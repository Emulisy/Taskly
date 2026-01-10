import "./completePage.css";
import TaskList from "../TaskList/TaskList";

export default class CompletePage {
  constructor(container) {
    this.container = container;
    this._render();
  }

  _render() {
    this.container.innerHTML = `
        <div class="complete__wrapper">
          <h2 class="complete__header"> <i class="fa-solid fa-check-double"></i>  Tick your completed tasks! </h2>
        </div>
        <div class="complete__results"></div>
        <div class="complete__bg">
          <div class="complete__bg-left"></div>
          <div class="complete__bg-right"></div>
        <div>

      `;

    this.completeResults = this.container.querySelector(".complete__results");

    this.taskList = new TaskList(this.completeResults, { completed: true });
  }
}
