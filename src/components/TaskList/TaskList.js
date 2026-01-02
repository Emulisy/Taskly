import taskStore from "../../store/TaskStore.js";
import TaskItem from "../TaskItem/TaskItem.js";
import { parseDateToStr } from "../../util/util.js";
import "./taskList.css";

export default class TaskList {
  constructor(container, query = {}, add = true) {
    this.container = container;
    this.query = query;
    this.add = add;
    this.items = new Map(); //store the id and the TaskItem

    this.wrapper = document.createElement("div");
    this.wrapper.className = "task__wrapper";
    this.container.appendChild(this.wrapper);

    this.tasksContainer = document.createElement("div");
    this.tasksContainer.className = "task__tasks-container";
    this.wrapper.appendChild(this.tasksContainer);

    this._render_addBtn();
    this._render();
    this._addEventListeners();
  }

  _render_addBtn() {
    if (!this.add) return;
    this.addBtn = document.createElement("button");
    this.addBtn.className = "task__add-task-btn";
    this.addBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    this.wrapper.appendChild(this.addBtn);
  }

  _getFilteredTasks() {
    return taskStore.query(this.query);
  }

  _render() {
    this.items.clear();
    const tasks = this._getFilteredTasks();
    this.tasksContainer.innerHTML = "";

    if (tasks.length === 0) {
      this._renderNoTasks();
    } else {
      tasks.forEach((task) => {
        const item = new TaskItem(task);
        this.tasksContainer.appendChild(item.el);
        this.items.set(task.id, item);
      });
    }
  }

  _renderNoTasks() {
    this.tasksContainer.innerHTML = `
      <div class="task__no-task">
        <img src="/img/no-task.png" alt="no task"/>
      </div>
    `;
  }

  _removeTask(item) {
    item.remove();
    item.el.addEventListener(
      "animationend",
      () => {
        this.items.delete(item.task.id);
        if (this.items.size === 0) {
          this._renderNoTasks();
        }
      },
      { once: true }
    );
  }

  _addNewTask() {
    const { star, completed, date } = this.query;

    let task;

    if (star) {
      task = taskStore.addTask({ starred: true });
    } else if (completed) {
      task = taskStore.addTask({ completed: true });
    } else if (date) {
      task = taskStore.addTask({ endDate: parseDateToStr(date) });
    } else {
      task = taskStore.addTask();
    }
  }

  _addTask(newTask) {
    if (this.tasksContainer.querySelector(".task__no-task")) {
      this.tasksContainer.innerHTML = "";
    }
    const newItem = new TaskItem(newTask);
    this.tasksContainer.insertBefore(
      newItem.el,
      this.tasksContainer.firstChild
    );
    this.items.set(newTask.id, newItem);
    requestAnimationFrame(() => {
      newItem.el.classList.add("task--fade-in");
    });
  }

  _addEventListeners() {
    this.addBtn?.addEventListener("click", () => this._addNewTask());

    taskStore.addEventListener("change", () => {
      this._render();
    });

    taskStore.addEventListener("updateTask", (e) => {
      const updatedTask = e.detail;
      const item = this.items.get(updatedTask.id);
      if (item && !taskStore.matches(updatedTask, this.query)) {
        //if the item exists but doesn't match the query
        this._removeTask(item);
      } else if (!item && taskStore.matches(updatedTask, this.query)) {
        //if the item doesn't exist but matches the query
        this._addTask(updatedTask);
      }
    });

    taskStore.addEventListener("deleteTask", (e) => {
      const deletedTaskId = e.detail.id;
      const item = this.items.get(deletedTaskId);
      if (item) {
        this._removeTask(item);
      }
    });

    taskStore.addEventListener("addTask", (e) => {
      const newTask = e.detail;
      if (this.items.has(newTask.id)) return;
      if (taskStore.matches(newTask, this.query)) {
        this._addTask(newTask);
      }
    });
  }

  setQuery(newQuery = {}) {
    this.query = newQuery;
    this._render();
  }

  isEmpty() {
    console.log(this.items);
    return this.items.size === 0;
  }
}
