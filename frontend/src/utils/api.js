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