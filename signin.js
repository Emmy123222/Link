// 🔹 Wait for DOM to load
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
            const response = await fetch("https://vuno-1.onrender.com/login/", {
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
                // 🔹 Save JWT tokens consistently
                localStorage.setItem("access_token", data.access || data.access_token);
                localStorage.setItem("refresh_token", data.refresh || data.refresh_token);

                alert("✅ Login successful!");

                // 🔹 Redirect (choose ONE)
                window.location.href = "index.html"; 
                // or use: window.location.href = "index.html";
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
    const token = localStorage.getItem("access_token");
    if (!token) return console.error("❌ No access token found");

    try {
        const res = await fetch("https://vuno-1.onrender.com/profile/", {
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
                window.location.href = "login.html";
            }
            return;
        }

        const profile = await res.json();
        console.log("Profile:", profile);

        // Update DOM if those elements exist
        const emailElem = document.getElementById("user-email");
        const usernameElem = document.getElementById("user-username");

        if (emailElem) emailElem.innerText = profile.email;
        if (usernameElem) usernameElem.innerText = profile.username;
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}
