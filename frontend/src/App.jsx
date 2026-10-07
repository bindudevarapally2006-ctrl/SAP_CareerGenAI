import { useState } from "react";
import "./App.css";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "./api";
import Dashboard from "./Dashboard";


function App() {

  // ==========================================
  // LOGIN STATUS
  // ==========================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );


  // ==========================================
  // MODAL
  // ==========================================

  const [showAuth, setShowAuth] = useState(false);

  const [authMode, setAuthMode] = useState("login");


  // ==========================================
  // LOGIN DATA
  // ==========================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // ==========================================
  // REGISTER DATA
  // ==========================================

  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skills, setSkills] = useState("");


  // ==========================================
  // STATUS
  // ==========================================

  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  // ==========================================
  // OPEN LOGIN
  // ==========================================

  const openLogin = () => {
    setAuthMode("login");
    setAuthError("");
    setAuthSuccess("");
    setShowAuth(true);
  };


  // ==========================================
  // OPEN REGISTER
  // ==========================================

  const openRegister = () => {
    setAuthMode("register");
    setAuthError("");
    setAuthSuccess("");
    setShowAuth(true);
  };


  // ==========================================
  // CLOSE AUTH
  // ==========================================

  const closeAuth = () => {

    if (loading) {
      return;
    }

    setShowAuth(false);
    setAuthError("");
    setAuthSuccess("");
  };


  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {

    e.preventDefault();

    setAuthError("");
    setAuthSuccess("");
    setLoading(true);

    try {

      const data = await loginUser(
        email.trim(),
        password
      );

      console.log("Login successful:", data);

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "student_id",
        data.student_id
      );

      setEmail("");
      setPassword("");

      setShowAuth(false);

      setIsLoggedIn(true);

    } catch (error) {

      console.error("Login error:", error);

      setAuthError(
        error.message || "Invalid email or password."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (e) => {

    e.preventDefault();

    setAuthError("");
    setAuthSuccess("");
    setLoading(true);

    try {

      const userData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        branch: branch.trim(),
        cgpa: cgpa ? Number(cgpa) : null,
        target_role: targetRole.trim(),
        skills: skills.trim(),
      };

      const data = await registerUser(userData);

      console.log("Registration successful:", data);

      setAuthSuccess(
        "Account created successfully! Please login."
      );

      // Clear registration fields
      setName("");
      setBranch("");
      setCgpa("");
      setTargetRole("");
      setSkills("");
      setPassword("");

      // Automatically switch to login
      setTimeout(() => {
        setAuthMode("login");
        setAuthSuccess("");
      }, 1200);

    } catch (error) {

      console.error("Registration error:", error);

      setAuthError(
        error.message || "Unable to create account."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    logoutUser();

    setIsLoggedIn(false);
    setShowAuth(false);
  };


  // ==========================================
  // SHOW DASHBOARD
  // ==========================================

  if (isLoggedIn) {

    return (
      <Dashboard
        onLogout={handleLogout}
      />
    );
  }


  // ==========================================
  // LANDING PAGE
  // ==========================================

  return (

    <div className="app">


      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="navbar">

        <div className="logo">
          Career<span>GenAI</span>
        </div>


        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#about">
            About
          </a>

          <button
            className="nav-login-button"
            onClick={openLogin}
          >
            Login
          </button>

        </div>

      </nav>


      {/* ======================================
          HERO
      ====================================== */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <div className="hero-badge">
            ✦ AI-POWERED CAREER PLATFORM
          </div>

          <h1>
            Build Your Career
            <br />
            With <span>AI</span>
          </h1>

          <p className="hero-description">
            CareerGenAI helps students analyze their
            resumes, discover suitable jobs, prepare
            for interviews, and understand their
            career readiness.
          </p>


          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={openRegister}
            >
              Get Started
              <span>→</span>
            </button>

            <button
              className="secondary-button"
              onClick={openLogin}
            >
              Already have an account?
              <span>Login</span>
            </button>

          </div>

        </div>


        {/* HERO VISUAL */}

        <div className="hero-visual">

          <div className="dashboard-preview">

            <div className="preview-header">

              <div>
                <small>
                  CAREER READINESS
                </small>

                <h3>
                  Your Career Overview
                </h3>
              </div>

              <div className="preview-avatar">
                CG
              </div>

            </div>


            <div className="preview-score">

              <div>

                <span>
                  Placement Score
                </span>

                <strong>
                  85
                  <small>/100</small>
                </strong>

              </div>

              <div className="score-ring">
                85%
              </div>

            </div>


            <div className="preview-cards">

              <div>
                <span>📄</span>
                <strong>Resume</strong>
                <small>Excellent</small>
              </div>

              <div>
                <span>🎤</span>
                <strong>Interview</strong>
                <small>Good</small>
              </div>

              <div>
                <span>💼</span>
                <strong>Jobs</strong>
                <small>3 Matches</small>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================
          FEATURES
      ====================================== */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <div className="section-label">
            FEATURES
          </div>

          <h2>
            Everything You Need
            <br />
            <span>To Build Your Career</span>
          </h2>

          <p>
            One intelligent platform to help you
            become placement-ready.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon purple">
              📄
            </div>

            <h3>
              Resume Analyzer
            </h3>

            <p>
              Upload your resume and receive an
              AI-powered score with useful
              improvement suggestions.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon blue">
              🎯
            </div>

            <h3>
              Placement Score
            </h3>

            <p>
              Understand your career readiness
              through an intelligent placement score.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon green">
              💼
            </div>

            <h3>
              Job Recommendations
            </h3>

            <p>
              Discover opportunities based on your
              skills and target career role.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon orange">
              🎤
            </div>

            <h3>
              AI Interview
            </h3>

            <p>
              Practice interview questions and
              understand your performance.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================
          ABOUT
      ====================================== */}

      <section
        className="about-section"
        id="about"
      >

        <div className="about-box">

          <div className="about-content">

            <div className="section-label">
              ABOUT CAREERGENAI
            </div>

            <h2>
              Your Personal
              <br />
              <span>AI Career Companion</span>
            </h2>

            <p>
              CareerGenAI is designed to help students
              understand where they currently stand
              and what they should do next to become
              placement-ready.
            </p>

            <p>
              From resume analysis to job recommendations
              and interview preparation, everything is
              brought together in one intelligent platform.
            </p>

          </div>


          <div className="about-stat">

            <div>
              <strong>
                AI
              </strong>

              <span>
                Powered
              </span>
            </div>

            <div>
              <strong>
                24/7
              </strong>

              <span>
                Career Support
              </span>
            </div>

            <div>
              <strong>
                360°
              </strong>

              <span>
                Career Analysis
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* ======================================
          FOOTER
      ====================================== */}

      <footer>

        <div className="footer-logo">
          Career<span>GenAI</span>
        </div>

        <p>
          Your AI-powered career companion.
        </p>

        <small>
          © 2026 CareerGenAI. All rights reserved.
        </small>

      </footer>


      {/* ======================================
          AUTH MODAL
      ====================================== */}

      {showAuth && (

        <div
          className="auth-overlay"
          onClick={closeAuth}
        >

          <div
            className="auth-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE */}

            <button
              className="auth-close"
              onClick={closeAuth}
              disabled={loading}
            >
              ×
            </button>


            {/* LEFT SIDE */}

            <div className="auth-info">

              <div className="auth-brand">
                Career<span>GenAI</span>
              </div>

              <div className="auth-info-content">

                <div className="auth-big-icon">
                  {authMode === "login" ? "✦" : "🚀"}
                </div>

                <h2>
                  {authMode === "login"
                    ? "Welcome Back"
                    : "Start Your Journey"}
                </h2>

                <p>
                  {authMode === "login"
                    ? "Continue building your career with AI-powered insights."
                    : "Create your free account and take the next step toward your dream career."}
                </p>

                <div className="auth-points">

                  <div>
                    ✓ AI Resume Analysis
                  </div>

                  <div>
                    ✓ Personalized Job Matches
                  </div>

                  <div>
                    ✓ Interview Preparation
                  </div>

                  <div>
                    ✓ Career Readiness Score
                  </div>

                </div>

              </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="auth-form-area">

              <div className="auth-form-header">

                <h2>
                  {authMode === "login"
                    ? "Sign in"
                    : "Create account"}
                </h2>

                <p>
                  {authMode === "login"
                    ? "Enter your details to continue"
                    : "Fill in your details to get started"}
                </p>

              </div>


              {/* ERROR */}

              {authError && (

                <div className="auth-error">
                  ⚠ {authError}
                </div>

              )}


              {/* SUCCESS */}

              {authSuccess && (

                <div className="auth-success">
                  ✓ {authSuccess}
                </div>

              )}


              {/* ==============================
                  LOGIN FORM
              ============================== */}

              {authMode === "login" ? (

                <form onSubmit={handleLogin}>

                  <div className="input-group">

                    <label>
                      Email address
                    </label>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                      disabled={loading}
                    />

                  </div>


                  <div className="input-group">

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      disabled={loading}
                    />

                  </div>


                  <button
                    className="auth-submit"
                    type="submit"
                    disabled={loading}
                  >

                    {loading
                      ? "Signing in..."
                      : "Sign in"}

                    {!loading && (
                      <span>→</span>
                    )}

                  </button>


                  <div className="auth-switch">

                    <span>
                      Don't have an account?
                    </span>

                    <button
                      type="button"
                      onClick={openRegister}
                    >
                      Create one
                    </button>

                  </div>

                </form>

              ) : (


                /* ==============================
                   REGISTER FORM
                ============================== */

                <form onSubmit={handleRegister}>

                  <div className="form-row">

                    <div className="input-group">

                      <label>
                        Full name
                      </label>

                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        required
                        disabled={loading}
                      />

                    </div>


                    <div className="input-group">

                      <label>
                        Branch
                      </label>

                      <input
                        type="text"
                        placeholder="CSE"
                        value={branch}
                        onChange={(e) =>
                          setBranch(e.target.value)
                        }
                        required
                        disabled={loading}
                      />

                    </div>

                  </div>


                  <div className="input-group">

                    <label>
                      Email address
                    </label>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                      disabled={loading}
                    />

                  </div>


                  <div className="form-row">

                    <div className="input-group">

                      <label>
                        CGPA
                      </label>

                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="8.5"
                        value={cgpa}
                        onChange={(e) =>
                          setCgpa(e.target.value)
                        }
                        required
                        disabled={loading}
                      />

                    </div>


                    <div className="input-group">

                      <label>
                        Target role
                      </label>

                      <input
                        type="text"
                        placeholder="Python Developer"
                        value={targetRole}
                        onChange={(e) =>
                          setTargetRole(e.target.value)
                        }
                        required
                        disabled={loading}
                      />

                    </div>

                  </div>


                  <div className="input-group">

                    <label>
                      Skills
                    </label>

                    <input
                      type="text"
                      placeholder="Python, SQL, JavaScript"
                      value={skills}
                      onChange={(e) =>
                        setSkills(e.target.value)
                      }
                      required
                      disabled={loading}
                    />

                  </div>


                  <div className="input-group">

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      minLength="6"
                      disabled={loading}
                    />

                  </div>


                  <button
                    className="auth-submit"
                    type="submit"
                    disabled={loading}
                  >

                    {loading
                      ? "Creating account..."
                      : "Create Account"}

                    {!loading && (
                      <span>→</span>
                    )}

                  </button>


                  <div className="auth-switch">

                    <span>
                      Already have an account?
                    </span>

                    <button
                      type="button"
                      onClick={openLogin}
                    >
                      Sign in
                    </button>

                  </div>

                </form>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;