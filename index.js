
document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = "http://127.0.0.1:8000";

  // 🔑 Load tokens from localStorage
  let accessToken = localStorage.getItem("authToken");
  let refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    console.warn("⚠️ No tokens found. Redirecting to login...");
    window.location.href = "signin.html";
    return;
  }

  // 🔄 Function to refresh token
  async function refreshAccessToken() {
    try {
      const response = await fetch(`${BASE_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      accessToken = data.access;
      localStorage.setItem("authToken", accessToken);
      console.log("🔄 Token refreshed!");
      return true;
    } catch (err) {
      console.error("❌ Refresh failed:", err);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "signin.html";
      return false;
    }
  }

  // 🔄 Fetch with auto-refresh retry
  async function fetchWithAuth(url, options = {}) {
    options.headers = {
      ...options.headers,
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    };

    let response = await fetch(url, options);

    // If token expired, try refresh once
    if (response.status === 401 && refreshToken) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        options.headers["Authorization"] = `Bearer ${accessToken}`;
        response = await fetch(url, options);
      }
    }

    return response;
  }

  // ===============================
  // 🔹 Fetch Profile
  // ===============================
  try {
    const response = await fetchWithAuth(`${BASE_URL}/profile/`);
    if (!response.ok) throw new Error("Failed to fetch profile");

    const data = await response.json();
    console.log("✅ Profile loaded:", data);

    // Full Name
    const fullName = data.first_name || data.last_name
      ? `${data.first_name || ""} ${data.last_name || ""}`.trim()
      : data.username;

    const profileName = document.getElementById("profileName");
    if (profileName) profileName.textContent = fullName;

    const profilePlan = document.getElementById("profilePlan");
    if (profilePlan) profilePlan.textContent = "Free Plan";

    const profileImage = document.getElementById("profileImage");
    const profileInitial = document.getElementById("profileInitial");

    if (data.profile && (data.profile.photo || data.profile.image)) {
      profileImage.src = data.profile.photo || data.profile.image;
      profileImage.style.display = "block";
      profileInitial.style.display = "none";
    } else {
      profileImage.style.display = "none";
      profileInitial.style.display = "flex";
      profileInitial.textContent = fullName.charAt(0).toUpperCase();
    }
  } catch (err) {
    console.error("❌ Error loading profile:", err);
  }

  // ===============================
  // 🔹 MOBILE NAV TOGGLE
  // ===============================
  const menuButton = document.getElementById("mobileMenuButton");
  const mobileNav = document.getElementById("mobileNav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      mobileNav.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      if (!menuButton.contains(event.target) && !mobileNav.contains(event.target)) {
        mobileNav.classList.add("hidden");
      }
    });
  }

  // ===============================
  // 🔹 SIDEBAR INTERACTIONS
  // ===============================
  const sidebar = document.querySelector(".lg\\:block");
  if (sidebar) {
    const navLinks = sidebar.querySelectorAll("nav a");
    const upgradeBtn = sidebar.querySelector("button");

    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove(
          "bg-primary-50", "dark:bg-primary-900/30", "text-primary-600", "dark:text-primary-300",
          "font-medium", "border", "border-primary-100", "dark:border-primary-700/50"
        ));
        link.classList.add(
          "bg-primary-50", "dark:bg-primary-900/30", "text-primary-600", "dark:text-primary-300",
          "font-medium", "border", "border-primary-100", "dark:border-primary-700/50"
        );
      });
    });

    if (upgradeBtn) {
      upgradeBtn.addEventListener("click", () => {
        alert("🚀 Upgrade feature coming soon!");
      });
    }

    const mobileToggle = document.querySelector("#sidebarToggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
      });
    }
  }
});

