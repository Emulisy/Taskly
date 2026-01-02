import taskStore from "./store/TaskStore.js";
import { initAuth } from "./bootstrap/auth.js";
import { initNav } from "./bootstrap/nav.js";
import { initCalendar } from "./bootstrap/calendar.js";
import { initLoading } from "./service/LoadingService.js";
import { initSearch } from "./bootstrap/search.js";
import { initStar } from "./bootstrap/starred.js";
import { initComplete } from "./bootstrap/completed.js";
import { initAllTasks } from "./bootstrap/allTasks.js";

import { SpeedInsights } from "@vercel/speed-insights/next"; //vercel speed insight

initNav();
initCalendar();
initSearch();
initStar();
initComplete();
initAllTasks();
initAuth(taskStore);
initLoading();

const themeToggleInput = document.querySelector("#theme-control");

themeToggleInput.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme");
});

const barBtn = document.querySelector(".header__bar-btn");
const nav = document.querySelector(".nav");
barBtn.addEventListener("click", () => {
  nav.classList.toggle("nav--active");
  barBtn.classList.toggle("header__bar-btn--active");
});
