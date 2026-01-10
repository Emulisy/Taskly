import TaskList from "../TaskList/TaskList.js";
import "./starPage.css";

export default class StarPage {
  constructor(container) {
    this.container = container;
    this._render();
  }

  _render() {
    this.container.innerHTML = `
      <div class="star__bg">
        <div class="star__bg-star"><i class="fa-solid fa-star"></i></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
      </div>
      <div class="star__wrapper">
        <h2 class="star__header"> <i class="fa-solid fa-star-half-stroke"></i> Star your important tasks! </h2>
      </div>
      <div class="star__results"></div>
    `;

    this.starResults = this.container.querySelector(".star__results");

    this.taskList = new TaskList(this.starResults, { star: true });
  }
}
