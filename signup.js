
document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const data = {
        first_name: form["first-name"].value,
        last_name: form["last-name"].value,
        email: form["email"].value,
        password: form["password"].value,
        confirm_password: form["confirm-password"].value,
        username: form["email"].value.split('@')[0],  // you can change this logic
    };

    const response = await fetch("https://vuno-1.onrender.com/accounts/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
        alert("Account created! Welcome, " + result.user.first_name + " 🎉");
        window.location.href = "signin.html";
    } else {
        alert("Signup failed: " + JSON.stringify(result));
    }
});

