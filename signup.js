document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  if (!form) {
    console.error("❌ signupForm not found in HTML.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Grab inputs safely (try camelCase or kebab-case IDs depending on HTML)
    const firstNameInput = document.getElementById("first-name") || document.getElementById("firstName");
    const lastNameInput = document.getElementById("last-name") || document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password") || document.getElementById("confirmPassword");

    if (!firstNameInput || !lastNameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
      console.error("❌ One or more input fields not found. Check your HTML IDs.");
      return;
    }

    const payload = {
      first_name: firstNameInput.value.trim(),
      last_name: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      confirm_password: confirmPasswordInput.value,
    };

    console.log("Form values:", payload);

    try {
      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Raw response:", response);

        const data = await response.json().catch(() => null);

            if (response.ok) {
                console.log("✅ Registration success:", data);
                alert("✅ Account created successfully!");
                // ✅ Redirect after success
                window.location.href = "signin.html";
            } else {
                console.error("❌ Server returned error:", data);
                const errorMsg = data
                    ? Object.entries(data).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n")
                    : response.statusText;
                alert(`❌ Error: ${errorMsg}`);
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
            alert(`⚠️ Network error: ${error.message}`);
        }
    });
});