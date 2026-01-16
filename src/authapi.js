const BASE_URL = "https://eventbackend1.onrender.com/api"

// REGISTER
export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
};

// LOGIN
export const loginUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};
