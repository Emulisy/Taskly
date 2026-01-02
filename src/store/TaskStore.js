import TaskService from "../service/TaskService.js";
import { matchDate, matchKeyword } from "../util/util.js";

class TaskStore extends EventTarget {
  constructor() {
    super();
    this.tasks = TaskService.loadFromLocal() || [];
    this.user = null;
    this.dirtyTasks = new Set(); //the updated tasks
    this.deletedTasks = new Set(); // deleted tasks
    this.newTasks = new Set(); //new tasks

    this._syncTimer = null; //the timer for  auto sync data
    this._syncDelay = 5000; //auto sync after 5s
  }

  _commit() {
    TaskService.saveToLocal(this.tasks);

    if (this.user) {
      this.scheduleSync();
    }
  }

  //set the user
  setUser(user) {
    this.user = user;
    this.dispatchEvent(new CustomEvent("change"));
  }

  clearUser() {
    this.user = null;
    this.tasks = [];
    this.dirtyTasks.clear();
    this.deletedTasks.clear();
    TaskService.clearLocal();
    this.dispatchEvent(new CustomEvent("change"));
  }

  // set the tasks
  setTasks(tasks) {
    this.tasks = tasks;
    this.dirtyTasks.clear();
    this.deletedTasks.clear();
    TaskService.saveToLocal(this.tasks);
    this.dispatchEvent(new CustomEvent("change"));
  }

  getAll() {
    return [...this.tasks];
  }

  async loadTasks(force = false) {
    if (!this.user) return;
    if (!force && this.tasks.length > 0) return;
    try {
      const tasks = await TaskService.loadTasksFromDB(this.user.id);
      this.tasks = tasks;
      TaskService.saveToLocal(this.tasks);
      this.dirtyTasks.clear();
      this.deletedTasks.clear();
    } catch (e) {
      console.error(e);
    }

    this.dispatchEvent(new CustomEvent("change"));
  }

  getTaskDateSet() {
    const set = new Set();

    for (const task of this.tasks) {
      if (!task.endDate) continue;
      set.add(task.endDate);
    }

    return set;
  }

  // adding a task to local storage
  addTask({
    title = "New Task",
    startDate = null,
    endDate = null,
    completed = false,
    starred = false,
  } = {}) {
    const newTask = {
      id: Date.now(), //temp id, will be updated when sync to supabase
      user_id: this.user?.id ?? null,
      title,
      startDate,
      endDate,
      completed,
      starred,
    };

    this.tasks.push(newTask);
    this.newTasks.add(newTask);

    this._commit();

    this.dispatchEvent(new CustomEvent("addTask", { detail: newTask }));

    return newTask;
  }

  // complete a task
  toggleComplete(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    task.completed = !task.completed;

    if (!this.newTasks.has(task)) {
      this.dirtyTasks.add(task);
    }

    this._commit();

    this.dispatchEvent(new CustomEvent("updateTask", { detail: task }));
  }

  // star a task
  toggleStar(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    task.starred = !task.starred;

    if (!this.newTasks.has(task)) {
      this.dirtyTasks.add(task);
    }

    this._commit();

    this.dispatchEvent(new CustomEvent("updateTask", { detail: task }));
  }

  // update a task filed(title，description, endDatem startDate)
  updateField(id, field, value) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    if (task[field] === value) return; //no change

    task[field] = value;

    if (!this.newTasks.has(task)) {
      this.dirtyTasks.add(task);
    }

    this._commit();

    this.dispatchEvent(new CustomEvent("updateTask", { detail: task }));
  }

  //remove a task from local storage
  remove(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;

    this.tasks = this.tasks.filter((t) => t.id !== id);

    if (this.newTasks.has(task)) {
      this.newTasks.delete(task);
    } else {
      this.deletedTasks.add(id);
    }

    this._commit();

    this.dispatchEvent(new CustomEvent("deleteTask", { detail: task }));
  }

  /**
   *query to get the target tasks, can be combination
   *
   * @param {*} [{ date, star, keyword,completed }={Date, bool, str, bool}]
   * @return {*}
   * @memberof TaskStore
   */
  query({ date, star, keyword, completed } = {}) {
    let result = [...this.tasks];
    return result.filter((task) =>
      this.matches(task, { date, star, keyword, completed })
    );
  }

  matches(task, { date, star, keyword, completed } = {}) {
    if (date && !matchDate(task, date)) return false;
    if (star !== undefined && task.starred !== star) return false;
    if (completed !== undefined && task.completed !== completed) return false;

    if (keyword) {
      if (!matchKeyword(task, keyword)) return false;
    }

    return true;
  }

  //sync to supabase
  async sync() {
    if (!this.user) return;

    try {
      // new tasks
      for (const task of [...this.newTasks]) {
        const { id, ...taskData } = task; // remove the temp id
        const saved = await TaskService.addTaskToDB(taskData);
        Object.assign(task, saved);
        this.newTasks.delete(task);
      }

      // dirty tasks
      for (const task of [...this.dirtyTasks]) {
        await TaskService.updateTaskInDB(task);
        this.dirtyTasks.delete(task);
      }

      // deleted tasks
      for (const id of [...this.deletedTasks]) {
        await TaskService.deleteTaskFromDB(id);
        this.deletedTasks.delete(id);
      }

      TaskService.saveToLocal(this.tasks);
      this.dispatchEvent(new CustomEvent("change"));
    } catch (error) {
      console.error("sync failed:", error);
    }
  }

  //trigger sync after timer, any user interaction with tasks will reset timer
  scheduleSync() {
    if (!this.user) return; //no user

    if (this._syncTimer) clearTimeout(this._syncTimer); //reset the timer

    this._syncTimer = setTimeout(async () => {
      await this.sync();
      this._syncTimer = null;
    }, this._syncDelay);
  }

  //when inputting fileds first stop sync and resume sync upon completion
  stopSync() {
    if (this._syncTimer) clearTimeout(this._syncTimer);
  }
}

const taskStore = new TaskStore();
export default taskStore;
