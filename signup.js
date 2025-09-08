
document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const first_name = document.getElementById("first-name").value.trim();
    const last_name = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const terms = document.getElementById("terms").checked;

    if (!terms) {
        alert("You must agree to the Terms of Service and Privacy Policy.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Auto-generate username from email if not collected
    const username = email.split("@")[0];

    try {
        const response = await fetch("https://vuno-1.onrender.com/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                first_name,
                last_name,
                username
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Account created successfully! Please log in.");
            window.location.href = "/signin.html"; // redirect to login
        } else {
            console.error("Signup error:", data);
            alert(data.message || "❌ Signup failed. Please check your details.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("⚠️ Something went wrong. Try again later.");
    }
});
 
