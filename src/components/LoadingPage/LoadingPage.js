import "./loadingPage.css";

export default class LoadingPage {
  constructor(container) {
    this.container = container;
    this._render();
  }

  _render() {
    this.container.innerHTML = `
      <div class="loader__wrapper loader__wrapper--hide">
        <h1 class="loader__text">Loading
            <span class="loader__dot"></span>
            <span class="loader__dot"></span>
            <span class="loader__dot"></span>
        </h1>
        <div class="loader__wave--1" ></div>
        <div class="loader__wave--2" ></div>
        <div class="loader__wave--3" ></div>
        <div class="loader__wave--4" ></div>
      </div>
    `;
  }

  show() {
    const wrapper = document.querySelector(".loader__wrapper");
    wrapper.classList.remove("loader__wrapper--hide");
  }

  hide() {
    const wrapper = document.querySelector(".loader__wrapper");
    wrapper.classList.add("loader__wrapper--hide");
  }
}
