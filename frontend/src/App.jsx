import React, { useState } from "react";

import Dashboard from "./Dashboard";

import {
  loginStudent,
  registerStudent,
} from "./api";

import "./App.css";


function App() {

  const [page, setPage] =
    useState("landing");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =========================
     LOGIN
  ========================= */

  const [loginForm, setLoginForm] =
    useState({
      email: "",
      password: "",
    });


  /* =========================
     REGISTER
  ========================= */

  const [registerForm, setRegisterForm] =
    useState({
      name: "",
      email: "",
      password: "",
      branch: "",
      cgpa: "",
      target_role: "",
      skills: "",
    });


  function updateLogin(field, value) {
    setLoginForm({
      ...loginForm,
      [field]: value,
    });
  }


  function updateRegister(field, value) {
    setRegisterForm({
      ...registerForm,
      [field]: value,
    });
  }


  /* =========================
     LOGIN SUBMIT
  ========================= */

  async function handleLogin(event) {

    event.preventDefault();

    setError("");
    setSuccess("");

    try {

      setLoading(true);

      const result =
        await loginStudent(loginForm);


      const token =
        result.access_token ||
        result.token;


      if (!token) {
        throw new Error(
          "Login successful, but no token was returned."
        );
      }


      localStorage.setItem(
        "token",
        token
      );


      localStorage.setItem(
        "student",
        JSON.stringify(result)
      );


      setPage("dashboard");

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Login failed."
      );

    } finally {

      setLoading(false);

    }
  }


  /* =========================
     REGISTER SUBMIT
  ========================= */

  async function handleRegister(event) {

    event.preventDefault();

    setError("");
    setSuccess("");

    try {

      setLoading(true);


      const payload = {
        ...registerForm,

        cgpa:
          registerForm.cgpa
            ? Number(registerForm.cgpa)
            : 0,

        skills:
          registerForm.skills
            .split(",")
            .map(
              (skill) =>
                skill.trim()
            )
            .filter(Boolean),
      };


      await registerStudent(
        payload
      );


      setSuccess(
        "Account created successfully. Please sign in."
      );


      setRegisterForm({
        name: "",
        email: "",
        password: "",
        branch: "",
        cgpa: "",
        target_role: "",
        skills: "",
      });


      setTimeout(() => {
        setPage("login");
        setSuccess("");
      }, 1000);


    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Registration failed."
      );

    } finally {

      setLoading(false);

    }
  }


  /* =========================
     IF LOGGED IN
  ========================= */

  if (
    localStorage.getItem("token") &&
    page === "dashboard"
  ) {
    return <Dashboard />;
  }


  /* =========================
     LANDING PAGE
  ========================= */

  if (page === "landing") {

    return (
      <div className="landing-page">

        <nav className="landing-nav">

          <div className="landing-brand">

            <div className="landing-logo">
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


          <div className="landing-nav-actions">

            <button
              onClick={() =>
                setPage("login")
              }
            >
              Sign in
            </button>

            <button
              className="nav-primary"
              onClick={() =>
                setPage("register")
              }
            >
              Get started
            </button>

          </div>

        </nav>


        <section className="hero">

          <div className="hero-content">

            <span className="hero-eyebrow">
              AI-POWERED CAREER PLATFORM
            </span>

            <h1>
              Build a career
              <br />

              <span>
                with confidence.
              </span>
            </h1>

            <p>
              CareerGenAI helps students understand
              their career readiness, improve their
              resumes, practice interviews and discover
              relevant opportunities.
            </p>


            <div className="hero-actions">

              <button
                className="hero-primary"
                onClick={() =>
                  setPage("register")
                }
              >
                Start your journey
                <span>→</span>
              </button>


              <button
                className="hero-secondary"
                onClick={() =>
                  setPage("login")
                }
              >
                I already have an account
              </button>

            </div>


            <div className="hero-trust">

              <div>
                <strong>
                  AI
                </strong>

                <span>
                  Career insights
                </span>
              </div>

              <div>
                <strong>
                  24/7
                </strong>

                <span>
                  Interview practice
                </span>
              </div>

              <div>
                <strong>
                  360°
                </strong>

                <span>
                  Career readiness
                </span>
              </div>

            </div>

          </div>


          <div className="hero-visual">

            <div className="dashboard-preview">

              <div className="preview-top">

                <div>
                  <span>
                    CAREER READINESS
                  </span>

                  <strong>
                    Your AI overview
                  </strong>
                </div>

                <div className="preview-dot">
                  •
                </div>

              </div>


              <div className="preview-score">

                <div className="preview-circle">
                  <strong>
                    78
                  </strong>

                  <span>
                    /100
                  </span>
                </div>

                <div>
                  <small>
                    PLACEMENT SCORE
                  </small>

                  <h3>
                    Good progress
                  </h3>

                  <p>
                    Keep improving your resume
                    and interview performance.
                  </p>
                </div>

              </div>


              <div className="preview-cards">

                <div>
                  <small>
                    RESUME
                  </small>

                  <strong>
                    82
                  </strong>
                </div>

                <div>
                  <small>
                    INTERVIEW
                  </small>

                  <strong>
                    74
                  </strong>
                </div>

                <div>
                  <small>
                    MATCHES
                  </small>

                  <strong>
                    12
                  </strong>
                </div>

              </div>


              <div className="preview-line">

                <span>
                  Career readiness
                </span>

                <div>
                  <i />
                </div>

              </div>

            </div>

          </div>

        </section>


        <section className="features">

          <div className="section-heading">

            <span>
              EVERYTHING IN ONE PLACE
            </span>

            <h2>
              A smarter way to prepare for your career.
            </h2>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <span>
                01
              </span>

              <h3>
                Resume Intelligence
              </h3>

              <p>
                Analyze your resume and understand
                how effectively it represents your
                skills and career goals.
              </p>

            </div>


            <div className="feature-card">

              <span>
                02
              </span>

              <h3>
                AI Interview Practice
              </h3>

              <p>
                Practice role-specific questions and
                receive structured feedback on your
                answers.
              </p>

            </div>


            <div className="feature-card">

              <span>
                03
              </span>

              <h3>
                Career Opportunities
              </h3>

              <p>
                Discover job opportunities aligned
                with your profile, skills and target
                role.
              </p>

            </div>

          </div>

        </section>


        <footer className="landing-footer">
          © 2026 CareerGenAI. Built for ambitious students.
        </footer>

      </div>
    );
  }


  /* =========================
     AUTH PAGE
  ========================= */

  return (
    <div className="auth-page">

      <div className="auth-brand">

        <button
          onClick={() =>
            setPage("landing")
          }
        >
          ← CareerGenAI
        </button>

      </div>


      <div className="auth-container">

        <div className="auth-info">

          <span>
            CAREER INTELLIGENCE
          </span>

          <h1>
            Turn your potential
            into a plan.
          </h1>

          <p>
            Build a stronger resume, practice
            interviews and understand your
            career readiness with one intelligent
            platform.
          </p>

        </div>


        <div className="auth-card">

          {page === "login" ? (

            <>
              <div className="auth-heading">

                <span>
                  WELCOME BACK
                </span>

                <h2>
                  Sign in to CareerGenAI
                </h2>

                <p>
                  Continue your career journey.
                </p>

              </div>


              <form
                onSubmit={handleLogin}
              >

                <label>
                  Email

                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      updateLogin(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="you@example.com"
                    required
                  />

                </label>


                <label>
                  Password

                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      updateLogin(
                        "password",
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    required
                  />

                </label>


                {error && (
                  <div className="auth-error">
                    {error}
                  </div>
                )}


                {success && (
                  <div className="auth-success">
                    {success}
                  </div>
                )}


                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </button>

              </form>


              <div className="auth-switch">

                Don't have an account?

                <button
                  onClick={() => {
                    setPage("register");
                    setError("");
                  }}
                >
                  Create one
                </button>

              </div>

            </>

          ) : (

            <>
              <div className="auth-heading">

                <span>
                  GET STARTED
                </span>

                <h2>
                  Create your account
                </h2>

                <p>
                  Build your career profile.
                </p>

              </div>


              <form
                onSubmit={handleRegister}
              >

                <div className="form-two">

                  <label>
                    Full name

                    <input
                      value={registerForm.name}
                      onChange={(event) =>
                        updateRegister(
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Your full name"
                      required
                    />

                  </label>


                  <label>
                    Email

                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(event) =>
                        updateRegister(
                          "email",
                          event.target.value
                        )
                      }
                      placeholder="you@example.com"
                      required
                    />

                  </label>

                </div>


                <label>
                  Password

                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(event) =>
                      updateRegister(
                        "password",
                        event.target.value
                      )
                    }
                    placeholder="Create a password"
                    required
                  />

                </label>


                <div className="form-two">

                  <label>
                    Branch

                    <input
                      value={registerForm.branch}
                      onChange={(event) =>
                        updateRegister(
                          "branch",
                          event.target.value
                        )
                      }
                      placeholder="CSE"
                      required
                    />

                  </label>


                  <label>
                    CGPA

                    <input
                      type="number"
                      step="0.01"
                      value={registerForm.cgpa}
                      onChange={(event) =>
                        updateRegister(
                          "cgpa",
                          event.target.value
                        )
                      }
                      placeholder="9.0"
                      required
                    />

                  </label>

                </div>


                <label>
                  Target role

                  <input
                    value={registerForm.target_role}
                    onChange={(event) =>
                      updateRegister(
                        "target_role",
                        event.target.value
                      )
                    }
                    placeholder="Data Analyst"
                    required
                  />

                </label>


                <label>
                  Skills

                  <input
                    value={registerForm.skills}
                    onChange={(event) =>
                      updateRegister(
                        "skills",
                        event.target.value
                      )
                    }
                    placeholder="Python, Java, SQL"
                  />

                  <small>
                    Separate skills with commas.
                  </small>

                </label>


                {error && (
                  <div className="auth-error">
                    {error}
                  </div>
                )}


                {success && (
                  <div className="auth-success">
                    {success}
                  </div>
                )}


                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}
                </button>

              </form>


              <div className="auth-switch">

                Already have an account?

                <button
                  onClick={() => {
                    setPage("login");
                    setError("");
                  }}
                >
                  Sign in
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}


export default App;