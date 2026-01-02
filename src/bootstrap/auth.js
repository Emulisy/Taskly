import UserLogin from "../components/UserLogin/UserLogin.js";
import UserProfile from "../components/UserProfile/UserProfile.js";
import { showLoading, hideLoading } from "../service/LoadingService.js";
import AuthService from "../service/AuthService.js";
import AlertService from "../service/AlertService.js";

export function initAuth(taskStore) {
  /* ===============================
     DOM references
  ================================ */
  const loginBtn = document.querySelector(".header__login-btn");
  const userInfo = document.querySelector(".header__user-info");
  const profileBtn = document.querySelector(".header__user-profile-btn");

  const loginOverlay = document.querySelector(".login__overlay");
  const loginContainer = document.querySelector(".login__container");
  const profileOverlay = document.querySelector(".user-profile__overlay");

  /* ===============================
     Components
  ================================ */
  new UserLogin(loginContainer);
  let profileComponent = null;

  /* ===============================
     UI helpers
  ================================ */
  function showLoggedInUI(user) {
    loginBtn.style.display = "none";
    userInfo.textContent =
      "Welcome " + (user.user_metadata?.name || user.email);
    profileBtn.style.display = "inline-block";
  }

  function showLoggedOutUI() {
    loginBtn.style.display = "inline-block";
    userInfo.style.display = "none";
    profileBtn.style.display = "none";
  }

  /* ===============================
     Core: apply user
  ================================ */
  function applyUser(user) {
    taskStore.setUser(user);

    if (user) {
      showLoggedInUI(user);

      if (!profileComponent) {
        profileComponent = new UserProfile(profileOverlay, { user });
      } else {
        profileComponent.setUser(user);
      }
    } else {
      showLoggedOutUI();
    }

    profileOverlay.classList.remove("user-profile__overlay--active");
  }

  /* ===============================
     UI interactions
  ================================ */
  loginBtn.addEventListener("click", () => {
    loginOverlay.classList.add("login__overlay--active");
  });

  loginOverlay.addEventListener("click", (e) => {
    if (e.target === loginOverlay) {
      loginOverlay.classList.remove("login__overlay--active");
    }
  });

  profileBtn.addEventListener("click", () => {
    if (profileComponent) {
      profileOverlay.classList.add("user-profile__overlay--active");
    }
  });

  /* ===============================
     Auth events (核心)
  ================================ */

  // Login
  window.addEventListener("auth:login", async (e) => {
    showLoading();
    try {
      const user = await AuthService.login(e.detail.email, e.detail.password);

      applyUser(user);
      await taskStore.loadTasks(true);
      loginOverlay.classList.remove("login__overlay--active");

      AlertService.show("Login successful!");
    } catch (err) {
      AlertService.show("Login failed: " + err.message);
    } finally {
      hideLoading();
    }
  });

  // Register
  window.addEventListener("auth:register", async (e) => {
    showLoading();
    try {
      const user = await AuthService.register(e.detail);
      applyUser(user);
      await taskStore.loadTasks(true);
      loginOverlay.classList.remove("login__overlay--active");

      AlertService.show("Register successful!");
    } catch (err) {
      AlertService.show("Register failed: " + err.message);
    } finally {
      hideLoading();
    }
  });

  // Update user
  window.addEventListener("auth:update", async (e) => {
    showLoading();
    try {
      const user = await AuthService.updateProfile(e.detail);
      applyUser(user);

      AlertService.show("Update successful!"); // replaced alert
    } catch (err) {
      AlertService.show("Failed to update profile: " + err.message); // replaced alert
    } finally {
      hideLoading();
    }
  });

  // Logout
  window.addEventListener("auth:logout", async () => {
    showLoading();
    try {
      await taskStore.sync();
      await AuthService.logout();
      taskStore.clearUser();
      applyUser(null);

      AlertService.show("You have logged out!"); // replaced alert
    } catch (err) {
      AlertService.show("Logout failed: " + err.message); // replaced alert
    } finally {
      hideLoading();
    }
  });

  /* ===============================
     Restore session
  ================================ */
  restoreSession();

  async function restoreSession() {
    showLoading();
    try {
      const user = await AuthService.restoreSession();
      if (user) {
        applyUser(user);
        await taskStore.loadTasks(true);
      }
    } catch (err) {
      AlertService.show("Failed to restore session: " + err.message); // replaced alert
    } finally {
      hideLoading();
    }
  }
}
