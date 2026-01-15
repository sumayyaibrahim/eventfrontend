
const BASE_URL = "https://eventbackend1.onrender.com";

// helper to get auth headers
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getEvents = async () => {
  const res = await fetch(BASE_URL, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
};

export const createEvent = async (event) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
};

export const updateEvent = async (id, event) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }
};
;
