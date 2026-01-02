import AllTasksPage from "../components/AllTasksPage/AllTasksPage";

export function initAllTasks() {
  new AllTasksPage(document.querySelector(".all-tasks"));
}
