document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signin-form");
    if (!form) return console.error("❌ Form 'signin-form' not found");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value.trim();

        if (!email || !password) {
            alert("⚠️ Please enter both email and password.");
            return;
        }

        try {
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

            if (response.ok && data.access && data.refresh) {
                // ✅ Save with consistent key names
                localStorage.setItem("authToken", data.access);
                localStorage.setItem("refreshToken", data.refresh);

                alert("✅ Login successful!");

                // ✅ Redirect AFTER saving
                window.location.href = "index.html";
            } else {
                const message = data?.non_field_errors?.[0] || data?.detail || "Login failed. Check your credentials.";
                alert(`❌ ${message}`);
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
            alert("⚠️ Network error. Try again later.");
        }
    });
});

// 🔹 Optional: fetch user profile
async function getProfile() {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("❌ No access token found");

    try {
        const res = await fetch("http://127.0.0.1:8000/profile/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error("Profile fetch failed:", res.status);
            if (res.status === 401 || res.status === 403) {
                alert("Unauthorized! Please log in again.");
                localStorage.clear();
                window.location.href = "signin.html"; // ✅ match actual page name
            }
            return;
        }

        const profile = await res.json();
        console.log("Profile:", profile);

        // Update DOM if available
        const emailElem = document.getElementById("user-email");
        const usernameElem = document.getElementById("user-username");

        if (emailElem) emailElem.innerText = profile.email;
        if (usernameElem) usernameElem.innerText = profile.username;
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}
