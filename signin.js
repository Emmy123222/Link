
document.getElementById("signin-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("https://vuno-1.onrender.com/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save tokens to localStorage for later authenticated requests
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            alert("Login successful! 🎉");
            // Redirect user to dashboard/profile page
            window.location.href = "index.html";  
        } else {
            alert(data.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Try again later.");
    }
});

