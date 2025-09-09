// 🔹 Handle Sign-in Form Submit
document.getElementById("signin-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("https://vuno-1.onrender.com/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }) // ✅ send email, not username
        });

        const data = await response.json();
        console.log("Login response:", data);

        if (response.ok) {
            // ✅ Save tokens consistently
            localStorage.setItem("authToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);

            alert("Login successful! 🎉");

            // Redirect to profile/dashboard
            window.location.href = "index.html";
        } else {
            alert(data.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Try again later.");
    }
});

// 🔹 Fetch Profile (Authenticated)
async function getProfile() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.error("No token found! Please login first.");
        return;
    }

    try {
        const res = await fetch("https://vuno-1.onrender.com/profile/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // ✅ JWT auth header
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error("Profile fetch failed:", res.status);
            if (res.status === 403) {
                alert("Unauthorized! Please log in again.");
            }
        } else {
            const profile = await res.json();
            console.log("Profile:", profile);

            // Example: show username/email on page
            document.getElementById("user-email").innerText = profile.email;
            document.getElementById("user-username").innerText = profile.username;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}
