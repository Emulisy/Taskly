import "./CustomAlert.css";

let instance = null;

export default class CustomAlert {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("alert__wrapper");
    document.body.appendChild(this.wrapper);

    this.wrapper.innerHTML = `
      <p class="alert__text"></p>
      <button class="alert__close"><i class="fa-solid fa-circle-xmark"></i></button>
    `;

    this.textWrapper = this.wrapper.querySelector(".alert__text");
    this.closeBtn = this.wrapper.querySelector(".alert__close");

    this.closeBtn.addEventListener("click", () => {
      this._hide();
    });

    this.timeout = null;
  }

  show(text, duration = 3000) {
    if (this.timeout) clearTimeout(this.timeout);

    this.textWrapper.textContent = text;
    this.wrapper.classList.add("show");

    this.timeout = setTimeout(() => this._hide(), duration);
  }

  _hide() {
    this.wrapper.classList.remove("show");
  }
}
