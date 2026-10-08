const API_BASE_URL = "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* =========================
   AUTH
========================= */

export async function registerStudent(data) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Registration failed");
  }

  return result;
}


export async function loginStudent(data) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Login failed");
  }

  return result;
}


/* =========================
   PROFILE
========================= */

export async function getProfile() {
  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    method: "GET",
    headers: authHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Unable to load profile");
  }

  return result;
}


/* =========================
   DASHBOARD
========================= */

export async function getDashboard() {
  const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    method: "GET",
    headers: authHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Unable to load dashboard");
  }

  return result;
}


/* =========================
   RESUME
========================= */

export async function uploadResume(file) {
  const token = getToken();

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/resume/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Resume upload failed");
  }

  return result;
}


/* =========================
   INTERVIEW
========================= */

export async function getInterviewQuestions() {
  const response = await fetch(
    `${API_BASE_URL}/interviews/questions`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Unable to load interview questions"
    );
  }

  return result;
}


export async function evaluateInterviewAnswer(
  question,
  answer
) {
  const response = await fetch(
    `${API_BASE_URL}/interviews/evaluate`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        question,
        answer,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Unable to evaluate answer"
    );
  }

  return result;
}


export async function saveInterviewPerformance(scores) {
  const response = await fetch(
    `${API_BASE_URL}/interviews/performance`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        scores,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail ||
        "Unable to save interview performance"
    );
  }

  return result;
}


/* =========================
   LOGOUT
========================= */

export function logoutStudent() {
  localStorage.removeItem("token");
  localStorage.removeItem("student");

  window.location.href = "/";
}