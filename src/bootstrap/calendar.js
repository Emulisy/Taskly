import CalendarPage from "../components/CalendarPage/CalendarPage";

export function initCalendar() {
  new CalendarPage(document.querySelector(".calendar"));
}
