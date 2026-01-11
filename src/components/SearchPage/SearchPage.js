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
      <div class="search__bg"></div>
    `;

    this.searchForm = this.container.querySelector(".search__form");
    this.searchInput = this.container.querySelector(".search__input");
    this.searchBtn = this.container.querySelector(".search__submit-btn");
    this.searchResults = this.container.querySelector(".search__results");
    const container = document.querySelector(".search__bg");

    this.taskList = new TaskList(this.searchResults, {}, false); //initialize the taskList
    this._generateDot(container);
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

  _generateDot(container) {
    const rowCounts = [3, 5, 6, 6, 6, 5, 3];
    const dotSize = 40;
    const gapX = 15;
    const gapY = 10;
    const stepX = dotSize + gapX;
    const stepY = dotSize + gapY;

    const points = [];
    const allDots = []; // 用于存储所有小球引用
    let maxDelay = 0;

    rowCounts.forEach((count, rowIndex) => {
      for (let i = 0; i < count; i++) {
        const rowWidth = (count - 1) * stepX;
        const startX = (400 - rowWidth) / 2;
        const x = startX + i * stepX;
        const y = rowIndex * stepY;
        points.push({ x, y });
      }
    });

    const avgX = points.reduce((s, p) => s + p.x, 0) / points.length;
    const avgY = points.reduce((s, p) => s + p.y, 0) / points.length;

    points.forEach((p) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.left = p.x + "px";
      dot.style.top = p.y + "px";

      const dist = Math.sqrt(Math.pow(p.x - avgX, 2) + Math.pow(p.y - avgY, 2));
      const delay = dist / 200;
      dot.style.animationDelay = delay + "s";

      if (delay > maxDelay) maxDelay = delay;

      container.appendChild(dot);
      allDots.push(dot);
    });

    setTimeout(() => {
      this._startRandomSparkle(allDots);
    }, (maxDelay + 0.8) * 1000);
  }

  _startRandomSparkle(dots) {
    setInterval(() => {
      const count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        const target = dots[Math.floor(Math.random() * dots.length)];

        if (!target.classList.contains("sparkle")) {
          target.classList.add("sparkle");
          setTimeout(() => {
            target.classList.remove("sparkle");
          }, 2000);
        }
      }
    }, 2000);
  }
}
