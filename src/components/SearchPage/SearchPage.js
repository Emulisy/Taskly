import TaskList from "../TaskList/TaskList.js";
import "./searchPage.css";
import AlertService from "../../service/AlertService.js";

export default class SearchPage {
  constructor(container) {
    this.container = container;
    this.keyword = "";

    this._render();
    this._addEventListeners();
  }

  _render() {
    this.container.innerHTML = `
      <div class="search__wrapper">
        <h2 class="search__header"><i class="fa-solid fa-magnifying-glass"></i> Search your tasks! </h2>
        <div class="search__input-wrapper">
          <form class="search__form">
            <input class="search__input" placeholder="Search tasks..." />
          </form>
          <button class="search__submit-btn">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <div class="search__results"></div>
    `;

    this.searchForm = this.container.querySelector(".search__form");
    this.searchInput = this.container.querySelector(".search__input");
    this.searchBtn = this.container.querySelector(".search__submit-btn");
    this.searchResults = this.container.querySelector(".search__results");

    this.taskList = new TaskList(this.searchResults, {}, false); //initialize the taskList
  }

  _addEventListeners() {
    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.keyword = this.searchInput.value.trim();
      this._update();
    });

    this.searchBtn.addEventListener("click", () => {
      this.keyword = this.searchInput.value.trim();
      this._update();
    });
  }

  _update() {
    this.taskList.setQuery({ keyword: this.keyword });
    console.log(this.taskList);
    if (this.taskList.isEmpty()) {
      console.log("No task found");
      AlertService.show("No task found...");
    }
  }
}
