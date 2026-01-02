import "./userProfile.css";

export default class UserProfile {
  constructor(container, { user }) {
    this.container = container;
    this.user = user;

    this.render();
    this.addEventListeners();
  }

  setUser(user) {
    this.user = user;
    const nameInput = this.container.querySelector("#profile-name");
    const emailInput = this.container.querySelector("#profile-email");
    if (nameInput) nameInput.value = user.user_metadata?.name ?? "";
    if (emailInput) emailInput.value = user.email ?? "";
  }

  render() {
    this.container.innerHTML = `
      <div class="user-profile__wrapper">
        <i class="fa-solid fa-circle-user user-profile__icon"></i>
        <h2 class="user-profile__title">Your Profile</h2>
        <form class="user-profile__form">
          <div class="user-profile__form-box">
            <input type="text" id="profile-name" value="${
              this.user.user_metadata?.name ?? ""
            }" required placeholder=" " />
            <label for="profile-name">Name</label>
          </div>
          <div class="user-profile__form-box">
            <input type="email" id="profile-email" value="${
              this.user.email
            }" required placeholder=" " />
            <label for="profile-email">Email</label>
          </div>
          <div class="user-profile__form-box">
            <input type="password" id="profile-password" placeholder="New Password" />
            <label for="profile-password">Password</label>
          </div>
          <div class="user-profile__btns">
            <button type="submit" class="user-profile__btn-save">Save</button>
            <button type="button" class="user-profile__btn-cancel">Cancel</button>
            <button type="button" class="user-profile__btn-logout">Logout</button>
          </div>
        </form>
      </div>
    `;

    this.container.classList.add("user-profile__overlay--active");
  }

  addEventListeners() {
    const form = this.container.querySelector(".user-profile__form");
    const cancelBtn = this.container.querySelector(".user-profile__btn-cancel");
    const logoutBtn = this.container.querySelector(".user-profile__btn-logout");

    // Save changes → dispatch auth:update
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#profile-name").value.trim();
      const email = form.querySelector("#profile-email").value.trim();
      const password = form.querySelector("#profile-password").value;

      window.dispatchEvent(
        new CustomEvent("auth:update", { detail: { email, password, name } })
      );

      this.container.classList.remove("user-profile__overlay--active");
    });

    // Cancel → just close overlay
    cancelBtn.addEventListener("click", () => {
      this.container.classList.remove("user-profile__overlay--active");
    });

    // Logout → dispatch auth:logout
    logoutBtn.addEventListener("click", () => {
      this.container.classList.remove("user-profile__overlay--active");
      window.dispatchEvent(new Event("auth:logout"));
    });

    // Click outside overlay → close
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.container.classList.remove("user-profile__overlay--active");
      }
    });
  }
}
