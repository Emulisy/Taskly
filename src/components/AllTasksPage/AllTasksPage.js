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
        <div class="all__bg">
          <div class="all__bg-circle"></div>
          <div class="all__bg-circle"></div>
          <div class="all__bg-circle"></div>
          <svg class="circle-bg" width="800" height="800" viewBox="0 0 800 800">
            <circle cx="0" cy="400" r="180" fill="none" stroke="var(--color-accent)" stroke-width="4" stroke-dasharray="15 20"/>
            <circle cx="0" cy="400" r="220" fill="none" stroke="var(--color-accent-light)" stroke-width="4" stroke-dasharray="40 20"/>
            <circle cx="0" cy="400" r="300" fill="none" stroke="var(--color-accent-lighter)" stroke-width="4" stroke-dasharray="60 20"/>
          </svg>
        <div>
      `;

    this.allResults = this.container.querySelector(".all__results");

    this.taskList = new TaskList(this.allResults, {});
  }
}
