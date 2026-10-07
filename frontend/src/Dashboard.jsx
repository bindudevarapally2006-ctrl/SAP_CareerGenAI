import { useEffect, useState } from "react";
import "./Dashboard.css";
import { getDashboard, uploadResume } from "./api";

function Dashboard({ onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboard();

      console.log("Dashboard data:", data);
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("student_id");

    if (onLogout) {
      onLogout();
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setSelectedFile(null);
      setUploadMessage("Please select a PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setUploadMessage("File must be smaller than 10 MB.");
      return;
    }

    setSelectedFile(file);
    setUploadMessage("");
  }

  async function handleResumeUpload() {
    if (!selectedFile) {
      setUploadMessage("Please select your resume first.");
      return;
    }

    try {
      setUploading(true);
      setUploadMessage("");

      const result = await uploadResume(selectedFile);

      console.log("Upload result:", result);

      setUploadMessage(
        result?.message || "Resume uploaded successfully!"
      );

      setSelectedFile(null);

      await loadDashboard();
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage(
        err?.message || "Resume upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading your dashboard...</h2>
        <p>Please wait.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error-page">
        <div className="error-card">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>

          <button
            className="primary-dashboard-button"
            onClick={loadDashboard}
          >
            Try Again
          </button>

          <button
            className="secondary-dashboard-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-loading">
        <h2>No dashboard data available.</h2>
      </div>
    );
  }

  // -----------------------------
  // DASHBOARD DATA
  // -----------------------------

  const student = dashboard.student || {};
  const resume = dashboard.resume || {};
  const placement = dashboard.placement || {};
  const jobs = dashboard.jobs || {};
  const interview = dashboard.interview || {};

  const studentName = student.name || "Student";

  const firstName =
    studentName.trim().split(" ")[0] || "Student";

  const placementScore = Number(
    placement.placement_score || 0
  );

  const resumeScore = Number(
    resume.resume_score ||
      resume.score ||
      0
  );

  const interviewScore = Number(
    interview.overall_score ||
      interview.score ||
      0
  );

  const questionsAnswered = Number(
    interview.questions_answered || 0
  );

  const skills = Array.isArray(student.skills)
    ? student.skills.join(", ")
    : student.skills || "Not provided";

  const jobRecommendations = Array.isArray(
    jobs.recommendations
  )
    ? jobs.recommendations
    : [];

  const strengths = Array.isArray(placement.strengths)
    ? placement.strengths
    : [];

  const suggestions = Array.isArray(
    placement.suggestions
  )
    ? placement.suggestions
    : [];

  // -----------------------------
  // HOME
  // -----------------------------

  function HomeSection() {
    return (
      <>
        <div className="dashboard-topbar">
          <div>
            <h1>Career Dashboard</h1>
            <p>Your AI Career Companion</p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="welcome-card">
          <h2>
            Welcome back, {firstName} 👋
          </h2>

          <p>
            Here's a quick overview of your career
            readiness, resume, jobs and interview
            performance.
          </p>

          <button
            className="primary-dashboard-button"
            onClick={() => setActiveSection("resume")}
          >
            Improve My Resume
          </button>
        </div>

        <div className="main-score-card">
          <div>
            <h3>Placement Score</h3>

            <h1>{placementScore}/100</h1>

            <p>
              {placementScore >= 80
                ? "Excellent"
                : placementScore >= 60
                ? "Good"
                : placementScore >= 40
                ? "Needs Improvement"
                : "Getting Started"}
            </p>
          </div>
        </div>

        <div className="dashboard-grid">

          <div className="dashboard-card">
            <div className="card-icon">📄</div>

            <h3>Resume Score</h3>

            <h2>{resumeScore}/100</h2>

            <p>
              {resumeScore > 0
                ? "Resume analyzed"
                : "Upload your resume"}
            </p>

            <button
              className="card-button"
              onClick={() => setActiveSection("resume")}
            >
              Upload Resume
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🎯</div>

            <h3>Placement Score</h3>

            <h2>{placementScore}/100</h2>

            <p>Career readiness</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💼</div>

            <h3>Job Matches</h3>

            <h2>{jobRecommendations.length}</h2>

            <p>Recommended jobs</p>

            <button
              className="card-button"
              onClick={() => setActiveSection("jobs")}
            >
              View Jobs
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🎤</div>

            <h3>Interview Score</h3>

            <h2>{interviewScore}/100</h2>

            <p>
              {questionsAnswered} questions answered
            </p>

            <button
              className="card-button"
              onClick={() =>
                setActiveSection("interview")
              }
            >
              Practice
            </button>
          </div>

        </div>

        <div className="content-card">
          <h2>Your Profile</h2>

          <div className="profile-grid">

            <div>
              <span>Name</span>
              <strong>{studentName}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {student.email || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Branch</span>
              <strong>
                {student.branch || "Not provided"}
              </strong>
            </div>

            <div>
              <span>CGPA</span>
              <strong>
                {student.cgpa ?? "Not provided"}
              </strong>
            </div>

            <div>
              <span>Target Role</span>
              <strong>
                {student.target_role ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>Skills</span>
              <strong>{skills}</strong>
            </div>

          </div>
        </div>

        <div className="content-card">
          <h2>Career Readiness</h2>

          <div className="progress-item">
            <div className="progress-heading">
              <span>Resume</span>
              <span>{resumeScore}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    resumeScore,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-heading">
              <span>Placement</span>
              <span>{placementScore}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    placementScore,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-heading">
              <span>Interview</span>
              <span>{interviewScore}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    interviewScore,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="two-column-layout">

          <div className="content-card">
            <h2>💪 Strengths</h2>

            {strengths.length > 0 ? (
              <ul>
                {strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>
                Your strengths will appear here.
              </p>
            )}
          </div>

          <div className="content-card">
            <h2>🚀 Improvements</h2>

            {suggestions.length > 0 ? (
              <ul>
                {suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>
                Upload your resume to get
                personalized suggestions.
              </p>
            )}
          </div>

        </div>
      </>
    );
  }

  // -----------------------------
  // PROFILE
  // -----------------------------

  function ProfileSection() {
    return (
      <>
        <div className="section-header">
          <h1>My Profile</h1>
          <p>Your CareerGenAI profile</p>
        </div>

        <div className="content-card">
          <div className="profile-grid">

            <div>
              <span>Name</span>
              <strong>{studentName}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {student.email || "Not provided"}
              </strong>
            </div>

            <div>
              <span>Branch</span>
              <strong>
                {student.branch || "Not provided"}
              </strong>
            </div>

            <div>
              <span>CGPA</span>
              <strong>
                {student.cgpa ?? "Not provided"}
              </strong>
            </div>

            <div>
              <span>Target Role</span>
              <strong>
                {student.target_role ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>Skills</span>
              <strong>{skills}</strong>
            </div>

          </div>
        </div>
      </>
    );
  }

  // -----------------------------
  // RESUME
  // -----------------------------

  function ResumeSection() {
    return (
      <>
        <div className="section-header">
          <h1>Resume Analysis</h1>
          <p>
            Upload your resume for AI analysis.
          </p>
        </div>

        <div className="content-card">
          <h2>📄 Upload Resume</h2>

          <p>
            Please upload your resume as a PDF.
          </p>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <p>
              Selected: {selectedFile.name}
            </p>
          )}

          <button
            className="primary-dashboard-button"
            onClick={handleResumeUpload}
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : "Upload Resume"}
          </button>

          {uploadMessage && (
            <p className="upload-message">
              {uploadMessage}
            </p>
          )}
        </div>

        <div className="content-card">
          <h2>Resume Score</h2>

          <h1>{resumeScore}/100</h1>

          {resumeScore > 0 ? (
            <p>
              Your resume has been analyzed.
            </p>
          ) : (
            <p>
              Upload your resume to receive a score.
            </p>
          )}
        </div>
      </>
    );
  }

  // -----------------------------
  // JOBS
  // -----------------------------

  function JobsSection() {
    return (
      <>
        <div className="section-header">
          <h1>Job Matches</h1>
          <p>
            Recommended jobs based on your profile.
          </p>
        </div>

        <div className="content-card">

          {jobRecommendations.length === 0 ? (
            <div>
              <h2>No job matches yet.</h2>

              <p>
                Complete your profile to receive
                job recommendations.
              </p>
            </div>
          ) : (
            jobRecommendations.map(
              (job, index) => (
                <div
                  className="job-item"
                  key={index}
                >
                  <h3>
                    {job.title ||
                      job.role ||
                      "Recommended Job"}
                  </h3>

                  <p>
                    {job.company ||
                      "Company not specified"}
                  </p>

                  {job.location && (
                    <p>{job.location}</p>
                  )}

                  {job.match_score && (
                    <strong>
                      {job.match_score}% Match
                    </strong>
                  )}
                </div>
              )
            )
          )}

        </div>
      </>
    );
  }

  // -----------------------------
  // INTERVIEW
  // -----------------------------

  function InterviewSection() {
    return (
      <>
        <div className="section-header">
          <h1>Interview Practice</h1>

          <p>
            Prepare for your interviews.
          </p>
        </div>

        <div className="content-card">
          <div className="card-icon">🎤</div>

          <h2>Interview Score</h2>

          <h1>{interviewScore}/100</h1>

          <p>
            Questions answered:{" "}
            {questionsAnswered}
          </p>

          <button
            className="primary-dashboard-button"
            onClick={() =>
              setUploadMessage(
                "Interview practice is ready."
              )
            }
          >
            Start Interview
          </button>

          {uploadMessage && (
            <p className="upload-message">
              {uploadMessage}
            </p>
          )}
        </div>
      </>
    );
  }

  // -----------------------------
  // MAIN PAGE
  // -----------------------------

  return (
    <div className="career-dashboard">

      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          <h2>CareerGenAI</h2>
          <span>AI Career Companion</span>
        </div>

        <nav className="sidebar-nav">

          <button
            className={
              activeSection === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            className={
              activeSection === "profile"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("profile")
            }
          >
            👤 Profile
          </button>

          <button
            className={
              activeSection === "resume"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("resume")
            }
          >
            📄 Resume
          </button>

          <button
            className={
              activeSection === "jobs"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("jobs")
            }
          >
            💼 Jobs
          </button>

          <button
            className={
              activeSection === "interview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("interview")
            }
          >
            🎤 Interview
          </button>

        </nav>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      <main className="dashboard-main">

        {activeSection === "dashboard" && (
          <HomeSection />
        )}

        {activeSection === "profile" && (
          <ProfileSection />
        )}

        {activeSection === "resume" && (
          <ResumeSection />
        )}

        {activeSection === "jobs" && (
          <JobsSection />
        )}

        {activeSection === "interview" && (
          <InterviewSection />
        )}

      </main>

    </div>
  );
}

export default Dashboard;