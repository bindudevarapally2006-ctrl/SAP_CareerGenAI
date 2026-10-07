const API_URL = "http://127.0.0.1:8000";


// ==========================================
// LOGIN
// ==========================================

export async function loginUser(email, password) {

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Invalid email or password"
    );
  }

  return data;
}


// ==========================================
// REGISTER
// ==========================================

export async function registerUser(userData) {

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Registration failed"
    );
  }

  return data;
}


// ==========================================
// GET PROFILE
// ==========================================

export async function getProfile() {

  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/profile/me`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Unable to load profile"
    );
  }

  return data;
}


// ==========================================
// GET DASHBOARD
// ==========================================

export async function getDashboard() {

  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API_URL}/dashboard/summary`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Unable to load dashboard"
    );
  }

  return data;
}


// ==========================================
// UPLOAD RESUME
// ==========================================

export async function uploadResume(file) {

  const token = localStorage.getItem("access_token");

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/resume/upload`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Resume upload failed"
    );
  }

  return data;
}


// ==========================================
// LOGOUT
// ==========================================

export function logoutUser() {

  localStorage.removeItem("access_token");

  localStorage.removeItem("student_id");
}