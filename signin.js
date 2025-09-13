// 🔹 Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signin-form");
    if (!form) return console.error("❌ Form 'signin-form' not found");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 🔹 Get input values safely
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value.trim();

        if (!email || !password) {
            alert("⚠️ Please enter both email and password.");
            return;
        }

        try {
            // 🔹 POST to dj-rest-auth login endpoint
            const response = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => null);
            console.log("Login response:", data);

            if (response.ok) {
                // 🔹 Save JWT tokens
                localStorage.setItem("authToken", data.access_token || data.access);
                localStorage.setItem("refreshToken", data.refresh_token || data.refresh);

                alert("✅ Login successful!");

                // 🔹 Redirect to dashboard or index page
                window.location.href = "index.html";
            } else {
                // Handle common errors
                const message = data?.non_field_errors?.[0] || data?.detail || "Login failed. Check your credentials.";
                alert(`❌ ${message}`);
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
            alert("⚠️ Network error. Try again later.");
        }
    });
});

// 🔹 Optional: fetch user profile if logged in
async function getProfile() {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("❌ No auth token found");

    try {
        const res = await fetch("http://127.0.0.1:8000/profile/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error("Profile fetch failed:", res.status);
            if (res.status === 401 || res.status === 403) alert("Unauthorized! Please log in again.");
            return;
        }

        const profile = await res.json();
        console.log("Profile:", profile);

        // Example: update DOM
        document.getElementById("user-email").innerText = profile.email;
        document.getElementById("user-username").innerText = profile.username;
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}
