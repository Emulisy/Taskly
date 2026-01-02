import AlertService from "../../service/AlertService.js";
import taskStore from "../../store/TaskStore.js";
import "./taskItem.css";

export default class TaskItem {
  constructor(task) {
    this.task = task;
    this.el = document.createElement("div");
    this.el.className = "task";
    this._render();

    taskStore.addEventListener("updateTask", (e) => {
      if (e.detail.id === this.task.id) {
        this._render();
      }
    });
  }

  _render() {
    const { task } = this;

    this.el.innerHTML = `
      <div class="task__header">
        <label class="task__checkbox">
          <input type="checkbox" ${task.completed ? "checked" : ""}>
          <span class="checkbox__box"></span>
        </label>

        <div class="task__header-content">
          ${this._renderTitle()}
          ${this._renderDate()}
        </div>

        <button class="task__star">
          <i class="${
            task.starred ? "fa-solid task__star-true" : "fa-regular"
          } fa-star"></i>
        </button>

        <button class="task__delete">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;

    this._bindEvents(this.el);
    return this.el;
  }

  _renderTitle() {
    return `
      <input
        class="task__title-input"
        value="${this.task.title}"
        placeholder="Task title"
      >
    `;
  }

  _renderDate() {
    const { startDate, endDate } = this.task;

    return `
      <div class="task__date">
        <input
          type="date"
          class="task__date-input"
          value="${startDate || ""}"
        >
        <span class="task__date-separator">→</span>
        <input
          type="date"
          class="task__date-input"
          value="${endDate || ""}"
        >
      </div>
    `;
  }

  _bindEvents(el) {
    const { task } = this;

    // checkbox
    const checkbox = el.querySelector("input[type=checkbox]");
    checkbox.onchange = () => {
      taskStore.toggleComplete(task.id);
    };

    // title input
    const titleInput = el.querySelector(".task__title-input");

    titleInput.addEventListener("focus", () => {
      //stop sync when user start editing
      taskStore.stopSync();
    });

    titleInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.isComposing) {
        e.preventDefault();
        titleInput.blur();
      }
    });

    titleInput.addEventListener("blur", () => {
      const value = titleInput.value.trim();

      if (value !== task.title) {
        taskStore.updateField(task.id, "title", value);
      }
    });

    // date inputs
    const [startInput, endInput] = el.querySelectorAll(".task__date-input");

    [startInput, endInput].forEach((input) => {
      //when user start editing stop sync
      input.addEventListener("focus", () => {
        taskStore.stopSync();
      });
    });

    const updateDates = () => {
      if (
        startInput.value &&
        endInput.value &&
        startInput.value > endInput.value
      ) {
        AlertService.show("Start date cannot be later than end date");
        return;
      }

      taskStore.updateField(task.id, "startDate", startInput.value || null);
      taskStore.updateField(task.id, "endDate", endInput.value || null);
    };

    startInput.onchange = updateDates;
    endInput.onchange = updateDates;

    // delete / star
    const deleteBtn = el.querySelector(".task__delete");
    deleteBtn.addEventListener("click", (e) => {
      taskStore.remove(task.id);
      this.remove();
    });

    const starBtn = el.querySelector(".task__star");
    starBtn.addEventListener("click", (e) => {
      taskStore.toggleStar(task.id);
    });
  }

  remove() {
    requestAnimationFrame(() => {
      this.el.classList.add("task--fade-out");
      this.el.addEventListener("animationend", () => this.el.remove(), {
        once: true,
      });
    });
  }
}
