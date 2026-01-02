import "./allTasks.css";
import TaskList from "../TaskList/TaskList.js";

export default class AllTasksPage {
  constructor(container) {
    this.container = container;
    this._render();
  }

  _render() {
    this.container.innerHTML = `
        <div class="all__wrapper">
          <h2 class="all__header"><i class="fa-solid fa-list-check"></i> All your tasks! </h2>
        </div>
        <div class="all__results"></div>
      `;

    this.allResults = this.container.querySelector(".all__results");

    this.taskList = new TaskList(this.allResults, {});
  }
}
