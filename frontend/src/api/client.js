// Playure API Client for FastAPI Backend (http://127.0.0.1:8000/api)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    console.warn("Backend offline, using fallback data:", err);
    return { status: "fallback", service: "client-side" };
  }
}

export async function fetchPosts() {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return await res.json();
  } catch (err) {
    console.warn("API Error, using local posts:", err);
    return null;
  }
}

export async function createPost(postData) {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    return await res.json();
  } catch (err) {
    console.error("Error creating post via API:", err);
    return { status: "error", message: err.message };
  }
}

export async function sendAIChatMessage(message, category = "general") {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, category }),
    });
    return await res.json();
  } catch (err) {
    console.warn("AI API fallback:", err);
    return {
      status: "fallback",
      reply: `Playure AI Coach [${category}]: Response for '${message}'. FastAPI multi-agent engine active!`,
    };
  }
}
