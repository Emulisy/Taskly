import AlertService from "../../service/AlertService";
import "./userLogin.css";

/**
 * UserLogin: 只负责 UI 和用户意图
 */
export default class UserLogin {
  constructor(container) {
    this.container = container;
    this.mode = "login"; // login / register
    this.render();
    this.addEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="login__wrapper">
        <h2 class="login__header">${
          this.mode === "login" ? "Login" : "Register"
        }</h2>
        <form class="login__form">
          ${
            this.mode === "register"
              ? `<div class="login__form-box">
                  <input type="text" id="name" required placeholder=" " />
                  <label for="name">Name</label>
                </div>`
              : ""
          }

          <div class="login__form-box">
            <input type="email" id="email" required placeholder=" " />
            <label for="email">Email</label>
          </div>

          <div class="login__form-box">
            <input type="password" id="password" required placeholder=" " />
            <label for="password">Password</label>
          </div>

          ${
            this.mode === "register"
              ? `<div class="login__form-box">
                  <input type="password" id="passwordConfirm" required placeholder=" " />
                  <label for="passwordConfirm">Confirm Password</label>
                </div>`
              : ""
          }

          <input class="login__btn" type="submit" value="${
            this.mode === "login" ? "Login" : "Register"
          }" />
        </form>

        <button class="login__switch">${
          this.mode === "login" ? "Switch to Register" : "Switch to Login"
        }</button>
      </div>
    `;
  }

  addEventListeners() {
    const form = this.container.querySelector(".login__form");
    const switchBtn = this.container.querySelector(".login__switch");

    // 切换 login/register
    switchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.mode = this.mode === "login" ? "register" : "login";
      this.render();
      this.addEventListeners(); // 重新绑定事件
    });

    // 提交表单 → dispatch 事件
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = form.querySelector("#email").value.trim();
      const password = form.querySelector("#password").value;

      if (this.mode === "login") {
        window.dispatchEvent(
          new CustomEvent("auth:login", {
            detail: { email, password },
          })
        );
      } else {
        const name = form.querySelector("#name").value.trim();
        const passwordConfirm = form.querySelector("#passwordConfirm").value;

        if (password !== passwordConfirm) {
          AlertService.show("Passwords do not match");
          return;
        }

        window.dispatchEvent(
          new CustomEvent("auth:register", {
            detail: { email, password, name },
          })
        );
      }
    });
  }
}
