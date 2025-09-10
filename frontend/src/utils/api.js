export async function login(email, password) {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return await res.json();
}

export async function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export async function signup(email, password) {
  const res = await fetch("http://localhost:8000/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Signup failed");
  }

  return await res.json();
}

export async function getDailyFlag() {
  const res = await fetch("http://localhost:8000/daily", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch daily flag");
  }

  return await res.json();
}

export async function submitResult(success, attempts, token) {
  const res = await fetch("http://localhost:8000/game/results", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ success, attempts }),
  });

  if (!res.ok) throw new Error("Failed to submit result");
  return await res.json();
}

export async function getTodayResult(token) {
  if (!token) return null;

  const res = await fetch("http://localhost:8000/game/results/today", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (res.status === 401) throw new Error("Unauthorised"); 
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch today's result");
  
  return await res.json();  
}

function getLocalResults() {
  return JSON.parse(localStorage.getItem("flag-game-results") || "{}");
}

function setLocalResult(date, result) {
  const results = getLocalResults();
  results[date] = result;
  // Optionally, clean up old entries (keep only last 7 days)
  const dates = Object.keys(results).sort().reverse();
  dates.slice(7).forEach(d => delete results[d]);
  localStorage.setItem("flag-game-results", JSON.stringify(results));
}