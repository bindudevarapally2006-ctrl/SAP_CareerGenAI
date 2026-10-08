import React, { useEffect, useRef, useState } from "react";

import {
  getDashboard,
  getProfile,
  uploadResume,
  getInterviewQuestions,
  evaluateInterviewAnswer,
  saveInterviewPerformance,
  logoutStudent,
} from "./api";

import "./dashboard.css";


function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);

  const [activeSection, setActiveSection] = useState("dashboard");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================
     REFS
  ========================= */

  const fileInputRef = useRef(null);
  const answerInputRef = useRef(null);


  /* =========================
     INTERVIEW STATE
  ========================= */

  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const [interviewScores, setInterviewScores] = useState([]);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);

  const [interviewMessage, setInterviewMessage] = useState("");
  const [lastEvaluation, setLastEvaluation] = useState(null);


  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    loadDashboard();
  }, []);


  /*
     IMPORTANT:
     Focus the answer box only when the interview
     starts or when the question changes.

     It does NOT run when the user types.
     Therefore, typing will not remove focus.
  */
  useEffect(() => {
    if (
      interviewStarted &&
      answerInputRef.current
    ) {
      setTimeout(() => {
        answerInputRef.current?.focus();
      }, 0);
    }
  }, [
    currentQuestionIndex,
    interviewStarted,
  ]);


  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const dashboardData = await getDashboard();

      setDashboard(dashboardData);

      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (profileError) {
        console.log(
          "Profile loading skipped:",
          profileError
        );
      }

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Unable to load dashboard"
      );

    } finally {
      setLoading(false);
    }
  }


  /* =========================
     RESUME UPLOAD
  ========================= */

  async function handleResumeUpload(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      setUploadMessage(
        "Please upload a PDF resume."
      );

      return;
    }

    try {
      setUploading(true);
      setUploadMessage("");

      const result =
        await uploadResume(file);

      setUploadMessage(
        result.message ||
        "Resume uploaded successfully."
      );

      await loadDashboard();

    } catch (err) {
      console.error(err);

      setUploadMessage(
        err.message ||
        "Resume upload failed."
      );

    } finally {
      setUploading(false);
    }
  }


  /* =========================
     START INTERVIEW
  ========================= */

  async function handleStartInterview() {
    try {
      setInterviewLoading(true);
      setInterviewMessage("");

      setInterviewFinished(false);
      setInterviewStarted(false);

      setCurrentQuestionIndex(0);
      setCurrentAnswer("");

      setInterviewScores([]);
      setLastEvaluation(null);

      const result =
        await getInterviewQuestions();

      console.log(
        "Interview response:",
        result
      );

      if (
        !result.questions ||
        result.questions.length === 0
      ) {
        throw new Error(
          "No interview questions were generated."
        );
      }

      setInterviewQuestions(
        result.questions
      );

      setInterviewStarted(true);

      setActiveSection("interview");

    } catch (err) {
      console.error(err);

      setInterviewMessage(
        err.message ||
        "Unable to start interview."
      );

    } finally {
      setInterviewLoading(false);
    }
  }


  /* =========================
     GET QUESTION TEXT
  ========================= */

  function getQuestionText(question) {
    if (!question) {
      return "";
    }

    if (
      typeof question === "string"
    ) {
      return question;
    }

    if (
      typeof question === "object"
    ) {
      return (
        question.question ||
        question.text ||
        question.title ||
        ""
      );
    }

    return String(question);
  }


  /* =========================
     GET QUESTION CATEGORY
  ========================= */

  function getQuestionCategory(question) {
    if (
      !question ||
      typeof question !== "object"
    ) {
      return "Interview";
    }

    return (
      question.category ||
      question.type ||
      "Interview"
    );
  }


  /* =========================
     SUBMIT ANSWER
  ========================= */

  async function handleSubmitAnswer() {
    if (!currentAnswer.trim()) {
      setInterviewMessage(
        "Please write an answer before continuing."
      );

      return;
    }

    const currentQuestion =
      interviewQuestions[
        currentQuestionIndex
      ];

    const questionText =
      getQuestionText(
        currentQuestion
      );

    try {
      setInterviewLoading(true);
      setInterviewMessage("");
      setLastEvaluation(null);

      const result =
        await evaluateInterviewAnswer(
          questionText,
          currentAnswer.trim()
        );

      console.log(
        "Evaluation response:",
        result
      );

      const evaluation =
        result.evaluation ||
        result;

      let score =
        Number(evaluation.score) ||
        Number(
          evaluation.overall_score
        ) ||
        Number(
          evaluation.total_score
        ) ||
        Number(
          evaluation.rating
        ) ||
        0;

      if (score > 100) {
        score = 100;
      }

      if (score < 0) {
        score = 0;
      }

      const updatedScores = [
        ...interviewScores,
        score,
      ];

      setInterviewScores(
        updatedScores
      );

      setLastEvaluation(
        evaluation
      );

      const isLastQuestion =
        currentQuestionIndex >=
        interviewQuestions.length - 1;

      if (isLastQuestion) {

        const performance =
          await saveInterviewPerformance(
            updatedScores
          );

        console.log(
          "Interview performance:",
          performance
        );

        setInterviewFinished(true);
        setInterviewStarted(false);

        setInterviewMessage(
          "Interview completed successfully."
        );

        await loadDashboard();

      } else {

        setCurrentQuestionIndex(
          currentQuestionIndex + 1
        );

        setCurrentAnswer("");

        /*
          The focus effect will automatically
          focus the textarea for the next question.
        */
      }

    } catch (err) {
      console.error(err);

      setInterviewMessage(
        err.message ||
        "Unable to evaluate your answer."
      );

    } finally {
      setInterviewLoading(false);
    }
  }


  /* =========================
     DASHBOARD VALUES
  ========================= */

  const student =
    dashboard?.student || {};

  const resume =
    dashboard?.resume || {};

  const placement =
    dashboard?.placement || {};

  const jobs =
    dashboard?.jobs || {};

  const interview =
    dashboard?.interview || {};


  const studentName =
    student.name ||
    profile?.name ||
    "Student";


  const targetRole =
    student.target_role ||
    profile?.target_role ||
    "Career Seeker";


  const resumeScore =
    Number(
      resume.score ??
      resume.resume_score ??
      student.resume_score ??
      0
    );


  const placementScore =
    Number(
      placement.score ??
      placement.placement_score ??
      student.placement_score ??
      0
    );


  const interviewScore =
    Number(
      interview.overall_score ??
      interview.score ??
      student.interview_score ??
      0
    );


  const questionsAnswered =
    Number(
      interview.questions_answered ??
      student.interview_questions_answered ??
      0
    );


  const jobMatches =
    Number(
      jobs.count ??
      jobs.total ??
      jobs.matches ??
      0
    );


  const cgpa =
    student.cgpa ??
    profile?.cgpa ??
    "-";


  const skills =
    student.skills ||
    profile?.skills ||
    [];


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="app-loading">

        <div className="loading-spinner"></div>

        <h2>
          Loading CareerGenAI
        </h2>

        <p>
          Preparing your career dashboard...
        </p>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error && !dashboard) {
    return (
      <div className="app-loading">

        <div className="error-icon">
          !
        </div>

        <h2>
          Unable to load dashboard
        </h2>

        <p>
          {error}
        </p>

        <button
          className="primary-button"
          onClick={loadDashboard}
        >
          Try Again
        </button>

      </div>
    );
  }


  /* =========================
     NAVIGATION
  ========================= */

  function NavigationItem({
    id,
    icon,
    label,
  }) {
    return (
      <button
        className={
          `sidebar-nav-item ${
            activeSection === id
              ? "active"
              : ""
          }`
        }
        onClick={() => {
          setActiveSection(id);

          if (id !== "interview") {
            setInterviewMessage("");
          }
        }}
      >
        <span className="nav-icon">
          {icon}
        </span>

        <span>
          {label}
        </span>
      </button>
    );
  }


  /* =========================
     SCORE CIRCLE
  ========================= */

  function ScoreCircle({
    score,
    label,
  }) {
    return (
      <div className="score-circle-container">

        <div
          className="score-circle"
          style={{
            "--score":
              `${Math.min(
                Math.max(score, 0),
                100
              ) * 3.6}deg`,
          }}
        >
          <div className="score-circle-inner">

            <strong>
              {score}
            </strong>

            <span>
              /100
            </span>

          </div>
        </div>

        <div className="score-circle-label">
          {label}
        </div>

      </div>
    );
  }


  /* =========================
     DASHBOARD VIEW
  ========================= */

  function DashboardView() {
    return (
      <div className="dashboard-content">

        <div className="page-heading">

          <div>
            <span className="eyebrow">
              CAREER OVERVIEW
            </span>

            <h1>
              Welcome back,{" "}
              {studentName.split(" ")[0]}.
            </h1>

            <p>
              Here is your latest
              career-readiness overview.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={handleStartInterview}
            disabled={interviewLoading}
          >
            {interviewLoading
              ? "Starting..."
              : "Start Interview"}
          </button>

        </div>


        {interviewMessage && (
          <div className="dashboard-notice">
            {interviewMessage}
          </div>
        )}


        {/* SCORE CARDS */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-card-top">

              <span className="stat-label">
                PLACEMENT SCORE
              </span>

              <span className="stat-icon">
                ↗
              </span>

            </div>

            <div className="stat-value">
              {placementScore}
              <span>/100</span>
            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${Math.min(
                      placementScore,
                      100
                    )}%`,
                }}
              />

            </div>

            <p>
              Overall career readiness
            </p>

          </div>


          <div className="stat-card">

            <div className="stat-card-top">

              <span className="stat-label">
                RESUME SCORE
              </span>

              <span className="stat-icon">
                CV
              </span>

            </div>

            <div className="stat-value">
              {resumeScore}
              <span>/100</span>
            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${Math.min(
                      resumeScore,
                      100
                    )}%`,
                }}
              />

            </div>

            <p>
              Resume quality
            </p>

          </div>


          <div className="stat-card">

            <div className="stat-card-top">

              <span className="stat-label">
                INTERVIEW SCORE
              </span>

              <span className="stat-icon">
                AI
              </span>

            </div>

            <div className="stat-value">
              {interviewScore}
              <span>/100</span>
            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${Math.min(
                      interviewScore,
                      100
                    )}%`,
                }}
              />

            </div>

            <p>
              {questionsAnswered} questions answered
            </p>

          </div>


          <div className="stat-card">

            <div className="stat-card-top">

              <span className="stat-label">
                JOB MATCHES
              </span>

              <span className="stat-icon">
                #
              </span>

            </div>

            <div className="stat-value">
              {jobMatches}
            </div>

            <p>
              Recommended opportunities
            </p>

          </div>

        </div>


        {/* MAIN GRID */}

        <div className="main-dashboard-grid">

          {/* CAREER READINESS */}

          <div className="dashboard-card readiness-card">

            <div className="card-header">

              <div>

                <span className="card-eyebrow">
                  AI ANALYSIS
                </span>

                <h2>
                  Career readiness
                </h2>

              </div>

              <span className="ai-badge">
                AI Powered
              </span>

            </div>


            <div className="readiness-body">

              <ScoreCircle
                score={placementScore}
                label="Placement readiness"
              />


              <div className="readiness-details">

                <div className="readiness-item">

                  <span>
                    Resume
                  </span>

                  <strong>
                    {resumeScore}/100
                  </strong>

                </div>


                <div className="readiness-item">

                  <span>
                    Interview
                  </span>

                  <strong>
                    {interviewScore}/100
                  </strong>

                </div>


                <div className="readiness-item">

                  <span>
                    CGPA
                  </span>

                  <strong>
                    {cgpa}
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* PROFILE SUMMARY */}

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <span className="card-eyebrow">
                  YOUR PROFILE
                </span>

                <h2>
                  Career profile
                </h2>

              </div>

            </div>


            <div className="profile-summary">

              <div className="profile-avatar">
                {studentName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <h3>
                  {studentName}
                </h3>

                <p>
                  {targetRole}
                </p>

              </div>

            </div>


            <div className="profile-details">

              <div>

                <span>
                  Branch
                </span>

                <strong>
                  {student.branch || "-"}
                </strong>

              </div>


              <div>

                <span>
                  CGPA
                </span>

                <strong>
                  {cgpa}
                </strong>

              </div>

            </div>


            <button
              className="secondary-button full-width"
              onClick={() =>
                setActiveSection("profile")
              }
            >
              View Profile
            </button>

          </div>

        </div>


        {/* RESUME */}

        <div className="dashboard-card resume-card">

          <div className="card-header">

            <div>

              <span className="card-eyebrow">
                RESUME ANALYZER
              </span>

              <h2>
                Improve your resume
              </h2>

              <p>
                Upload your latest resume and let
                CareerGenAI analyze its quality.
              </p>

            </div>

            <div className="resume-score-mini">

              <strong>
                {resumeScore}
              </strong>

              <span>
                /100
              </span>

            </div>

          </div>


          <div className="upload-area">

            <div className="upload-icon">
              ↑
            </div>

            <div>

              <h3>
                {resume.filename
                  ? resume.filename
                  : "Upload your resume"}
              </h3>

              <p>
                PDF files only
              </p>

            </div>


            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              hidden
            />


            <button
              className="primary-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
            >
              {uploading
                ? "Analyzing..."
                : "Upload Resume"}
            </button>

          </div>


          {uploadMessage && (
            <div className="success-message">
              {uploadMessage}
            </div>
          )}

        </div>


        {/* QUICK ACTIONS */}

        <div className="section-title">

          <div>

            <span className="card-eyebrow">
              NEXT STEPS
            </span>

            <h2>
              Continue your career journey
            </h2>

          </div>

        </div>


        <div className="quick-actions-grid">

          <button
            className="action-card"
            onClick={() =>
              setActiveSection("resume")
            }
          >

            <span className="action-icon">
              CV
            </span>

            <div>

              <h3>
                Analyze Resume
              </h3>

              <p>
                Improve your resume score
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>


          <button
            className="action-card"
            onClick={handleStartInterview}
          >

            <span className="action-icon">
              AI
            </span>

            <div>

              <h3>
                Practice Interview
              </h3>

              <p>
                Test your interview readiness
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>


          <button
            className="action-card"
            onClick={() =>
              setActiveSection("jobs")
            }
          >

            <span className="action-icon">
              JOB
            </span>

            <div>

              <h3>
                Explore Jobs
              </h3>

              <p>
                Find suitable opportunities
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>

        </div>

      </div>
    );
  }


  /* =========================
     PROFILE VIEW
  ========================= */

  function ProfileView() {
    return (
      <div className="dashboard-content">

        <div className="page-heading">

          <div>

            <span className="eyebrow">
              PROFILE
            </span>

            <h1>
              Your career profile
            </h1>

            <p>
              Keep your career information up to date.
            </p>

          </div>

        </div>


        <div className="profile-page-card">

          <div className="profile-large">

            <div className="profile-avatar large">
              {studentName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <h2>
                {studentName}
              </h2>

              <p>
                {targetRole}
              </p>

            </div>

          </div>


          <div className="profile-info-grid">

            <div className="info-box">

              <span>
                Email
              </span>

              <strong>
                {student.email ||
                  profile?.email ||
                  "-"}
              </strong>

            </div>


            <div className="info-box">

              <span>
                Branch
              </span>

              <strong>
                {student.branch ||
                  profile?.branch ||
                  "-"}
              </strong>

            </div>


            <div className="info-box">

              <span>
                CGPA
              </span>

              <strong>
                {cgpa}
              </strong>

            </div>


            <div className="info-box">

              <span>
                Target Role
              </span>

              <strong>
                {targetRole}
              </strong>

            </div>

          </div>


          <div className="skills-section">

            <span>
              Skills
            </span>

            <div className="skills-list">

              {Array.isArray(skills) &&
              skills.length > 0 ? (

                skills.map(
                  (skill, index) => (

                    <span
                      className="skill-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )

              ) : (

                <span className="muted-text">
                  No skills added
                </span>

              )}

            </div>

          </div>

        </div>

      </div>
    );
  }


  /* =========================
     RESUME VIEW
  ========================= */

  function ResumeView() {
    return (
      <div className="dashboard-content">

        <div className="page-heading">

          <div>

            <span className="eyebrow">
              RESUME ANALYZER
            </span>

            <h1>
              Optimize your resume
            </h1>

            <p>
              Get an AI-powered assessment of your
              resume.
            </p>

          </div>

        </div>


        <div className="resume-page-grid">

          <div className="dashboard-card resume-upload-large">

            <div className="upload-icon large">
              ↑
            </div>

            <h2>
              Upload your resume
            </h2>

            <p>
              Upload a PDF version of your resume
              to analyze its structure, content and
              career relevance.
            </p>


            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              hidden
            />


            <button
              className="primary-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
            >
              {uploading
                ? "Analyzing Resume..."
                : "Choose PDF Resume"}
            </button>


            {uploadMessage && (
              <div className="success-message">
                {uploadMessage}
              </div>
            )}

          </div>


          <div className="dashboard-card">

            <span className="card-eyebrow">
              CURRENT SCORE
            </span>

            <h2>
              Resume quality
            </h2>

            <div className="large-score">

              {resumeScore}

              <span>
                /100
              </span>

            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${Math.min(
                      resumeScore,
                      100
                    )}%`,
                }}
              />

            </div>

            <p className="card-description">
              Upload a newer version to refresh
              your analysis.
            </p>

          </div>

        </div>

      </div>
    );
  }


  /* =========================
     JOBS VIEW
  ========================= */

  function JobsView() {

    const jobList =
      Array.isArray(jobs.items)
        ? jobs.items
        : Array.isArray(jobs.matches)
          ? jobs.matches
          : [];


    return (
      <div className="dashboard-content">

        <div className="page-heading">

          <div>

            <span className="eyebrow">
              JOB MATCHES
            </span>

            <h1>
              Opportunities for you
            </h1>

            <p>
              Career opportunities matched to your
              profile.
            </p>

          </div>

        </div>


        {jobList.length > 0 ? (

          <div className="jobs-grid">

            {jobList.map(
              (job, index) => (

                <div
                  className="job-card"
                  key={
                    job.id ||
                    index
                  }
                >

                  <div className="job-card-top">

                    <div className="company-logo">

                      {(
                        job.company ||
                        "C"
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    <span className="match-badge">

                      {job.match_score ||
                        job.match ||
                        "Match"}

                    </span>

                  </div>


                  <h3>
                    {job.title ||
                      job.role ||
                      "Career Opportunity"}
                  </h3>

                  <p>
                    {job.company ||
                      "Company"}
                  </p>


                  <div className="job-meta">

                    {job.location && (
                      <span>
                        {job.location}
                      </span>
                    )}

                    {job.type && (
                      <span>
                        {job.type}
                      </span>
                    )}

                  </div>


                  <button className="secondary-button full-width">
                    View Opportunity
                  </button>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-state">

            <div className="empty-icon">
              JOB
            </div>

            <h2>
              No job matches available yet
            </h2>

            <p>
              Complete your profile and resume
              analysis to receive better matches.
            </p>

          </div>

        )}

      </div>
    );
  }


  /* =========================
     INTERVIEW VIEW
  ========================= */

  function InterviewView() {

    /* =========================
       COMPLETED INTERVIEW
    ========================= */

    if (interviewFinished) {

      const total =
        interviewScores.reduce(
          (sum, score) =>
            sum + Number(score),
          0
        );

      const finalScore =
        interviewScores.length
          ? Math.round(
              total /
              interviewScores.length
            )
          : 0;


      return (
        <div className="dashboard-content">

          <div className="interview-complete">

            <div className="complete-icon">
              ✓
            </div>

            <span className="eyebrow">
              INTERVIEW COMPLETE
            </span>

            <h1>
              Great work,{" "}
              {studentName.split(" ")[0]}.
            </h1>

            <p>
              Your interview performance has been
              recorded.
            </p>


            <div className="final-score">

              <strong>
                {finalScore}
              </strong>

              <span>
                /100
              </span>

            </div>


            <div className="interview-summary">

              <div>

                <span>
                  Questions
                </span>

                <strong>
                  {interviewScores.length}
                </strong>

              </div>


              <div>

                <span>
                  Average score
                </span>

                <strong>
                  {finalScore}/100
                </strong>

              </div>

            </div>


            <button
              className="primary-button"
              onClick={() => {

                setInterviewFinished(false);
                setInterviewStarted(false);

                setInterviewQuestions([]);

                setInterviewScores([]);

                setCurrentQuestionIndex(0);

                setCurrentAnswer("");

                setLastEvaluation(null);

                setInterviewMessage("");

              }}
            >
              Practice Again
            </button>

          </div>

        </div>
      );
    }


    const currentQuestion =
      interviewQuestions[
        currentQuestionIndex
      ];

    const questionText =
      getQuestionText(
        currentQuestion
      );

    const category =
      getQuestionCategory(
        currentQuestion
      );


    return (
      <div className="dashboard-content">

        <div className="page-heading">

          <div>

            <span className="eyebrow">
              AI INTERVIEW
            </span>

            <h1>
              Interview practice
            </h1>

            <p>
              Practice answering questions tailored
              to your target role.
            </p>

          </div>

        </div>


        {!interviewStarted ? (

          /* =========================
             INTERVIEW START SCREEN
          ========================= */

          <div className="interview-start-card">

            <div className="interview-hero-icon">
              AI
            </div>

            <span className="eyebrow">
              AI-POWERED PRACTICE
            </span>

            <h2>
              Ready for your interview?
            </h2>

            <p>
              CareerGenAI will ask you role-specific
              interview questions and evaluate your
              answers.
            </p>


            <div className="interview-benefits">

              <div>

                <span>
                  01
                </span>

                <p>
                  Role-specific questions
                </p>

              </div>


              <div>

                <span>
                  02
                </span>

                <p>
                  AI answer evaluation
                </p>

              </div>


              <div>

                <span>
                  03
                </span>

                <p>
                  Performance score
                </p>

              </div>

            </div>


            <button
              className="primary-button large-button"
              onClick={handleStartInterview}
              disabled={interviewLoading}
            >
              {interviewLoading
                ? "Preparing Interview..."
                : "Start Interview"}
            </button>


            {interviewMessage && (
              <div className="error-message">
                {interviewMessage}
              </div>
            )}

          </div>

        ) : (

          /* =========================
             INTERVIEW WORKSPACE
          ========================= */

          <div className="interview-workspace">

            <div className="interview-progress">

              <div>

                <span>
                  QUESTION
                </span>

                <strong>
                  {currentQuestionIndex + 1}
                  {" "}
                  /
                  {" "}
                  {interviewQuestions.length}
                </strong>

              </div>


              <div className="question-progress-track">

                <div
                  className="question-progress-fill"
                  style={{
                    width:
                      `${
                        (
                          (
                            currentQuestionIndex + 1
                          ) /
                          interviewQuestions.length
                        ) *
                        100
                      }%`,
                  }}
                />

              </div>

            </div>


            <div className="interview-question-card">

              <span className="question-category">
                {category}
              </span>


              <h2>
                {questionText}
              </h2>


              {/* =========================
                  FIXED ANSWER TEXTAREA
              ========================= */}

              <textarea
                ref={answerInputRef}
                value={currentAnswer}
                onChange={(event) => {
                  /*
                    IMPORTANT:
                    Only update the answer.
                    Do not change activeSection,
                    question index, or interview state.
                  */
                  setCurrentAnswer(
                    event.target.value
                  );
                }}
                placeholder="Type your answer here..."
                rows={8}
                autoComplete="off"
                spellCheck={true}
              />


              {lastEvaluation && (
                <div className="evaluation-box">

                  <strong>
                    Previous answer evaluated
                  </strong>

                  <p>
                    Score:{" "}
                    {
                      lastEvaluation.score ??
                      lastEvaluation.overall_score ??
                      0
                    }
                    /100
                  </p>

                </div>
              )}


              {interviewMessage && (
                <div className="error-message">
                  {interviewMessage}
                </div>
              )}


              <div className="interview-actions">

                <span>
                  Take your time and answer clearly.
                </span>


                <button
                  className="primary-button"
                  onClick={handleSubmitAnswer}
                  disabled={
                    interviewLoading ||
                    !currentAnswer.trim()
                  }
                >
                  {interviewLoading
                    ? "Evaluating..."
                    : currentQuestionIndex ===
                      interviewQuestions.length - 1
                      ? "Finish Interview"
                      : "Submit & Continue"}
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    );
  }


  /* =========================
     MAIN
  ========================= */

  return (
    <div className="career-app">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            C
          </div>

          <div>

            <strong>
              CareerGenAI
            </strong>

            <span>
              Career Intelligence
            </span>

          </div>

        </div>


        <div className="sidebar-section">

          <span className="sidebar-label">
            WORKSPACE
          </span>


          <NavigationItem
            id="dashboard"
            icon="⌂"
            label="Dashboard"
          />


          <NavigationItem
            id="profile"
            icon="○"
            label="Profile"
          />


          <NavigationItem
            id="resume"
            icon="▤"
            label="Resume"
          />


          <NavigationItem
            id="jobs"
            icon="▣"
            label="Job Matches"
          />


          <NavigationItem
            id="interview"
            icon="◉"
            label="Interview"
          />

        </div>


        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="sidebar-avatar">

              {studentName
                .charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <strong>
                {studentName}
              </strong>

              <span>
                {targetRole}
              </span>

            </div>

          </div>


          <button
            className="logout-button"
            onClick={logoutStudent}
          >

            <span>
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* =========================
          MAIN AREA
      ========================= */}

      <main className="main-area">

        <header className="topbar">

          <div className="mobile-brand">
            CareerGenAI
          </div>

          <div className="topbar-spacer"></div>


          <div className="topbar-profile">

            <div className="topbar-avatar">

              {studentName
                .charAt(0)
                .toUpperCase()}

            </div>


            <div className="topbar-user">

              <strong>
                {studentName}
              </strong>

              <span>
                {targetRole}
              </span>

            </div>

          </div>

        </header>


        {activeSection === "dashboard" &&
          <DashboardView />
        }


        {activeSection === "profile" &&
          <ProfileView />
        }


        {activeSection === "resume" &&
          <ResumeView />
        }


        {activeSection === "jobs" &&
          <JobsView />
        }


        {/*
          IMPORTANT FIX:

          DO NOT use:

          <InterviewView />

          because InterviewView is declared inside
          Dashboard().

          Calling it directly prevents React from
          remounting the textarea every time
          currentAnswer changes.
        */}

        {activeSection === "interview" &&
          InterviewView()
        }

      </main>

    </div>
  );
}


export default Dashboard;