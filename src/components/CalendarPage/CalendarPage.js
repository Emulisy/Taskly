import taskStore from "../../store/TaskStore.js";
import TaskList from "../TaskList/TaskList.js";
import { parseDateToStr } from "../../util/util.js";
import "./calendarPage.css";

/**
 *render the calendar main page
 including the calendar and  the task list
 *
 Enable date selection, task list change with the date
 * @export
 * @class Calendar
 */
export default class CalendarPage {
  constructor(container) {
    this.container = container;
    this.today = new Date();
    this.year = this.today.getFullYear(); //the year of the calendar, by default is this year
    this.month = this.today.getMonth(); //the month of the calendar, by default is this month
    this.selectedDate = null; // A Date object of the selected date

    this._render();
  }

  // generate a 6*7 array of number including the date to be displayed
  _generateDates() {
    const totalCells = 6 * 7;
    const year = this.year;
    const month = this.month;

    const dates = []; //store the result array
    const daysInMonth = new Date(year, month + 1, 0).getDate(); //dates in the month
    const daysInPrevMonth = new Date(year, month, 0).getDate(); //dates in the prev month
    const firstWeekday = new Date(year, month, 1).getDay(); //the first day of the month in a week

    // prev month dates
    let prevMonth = month - 1 < 0 ? 11 : month - 1;
    let prevYear = month - 1 < 0 ? year - 1 : year;
    for (let i = firstWeekday - 1; i >= 0; i--) {
      dates.push({
        year: prevYear,
        month: prevMonth,
        day: daysInPrevMonth - i,
        currentMonth: false,
      });
    }

    // this month dates
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({ year, month, day: i, currentMonth: true });
    }

    // next month dates
    let nextMonth = month + 1 > 11 ? 0 : month + 1;
    let nextYear = month + 1 > 11 ? year + 1 : year;
    let nextDay = 1;
    while (dates.length < totalCells) {
      dates.push({
        year: nextYear,
        month: nextMonth,
        day: nextDay++,
        currentMonth: false,
      });
    }

    return dates;
  }

  // render the calendar and the task list
  _render() {
    this.container.innerHTML = `
      <div class="calendar__header">
        <button class="calendar__nav calendar__nav-prev"><i class="fa-solid fa-angle-left"></i></button>
        <div class="calendar__selectors">
          <div class="calendar__selector">
            <select class="calendar__select-year"></select>
            <i class="fa-solid fa-angle-down calendar__selector-icon"></i>
          </div>
          <div class="calendar__selector">
            <select class="calendar__select-month"></select>
            <i class="fa-solid fa-angle-down calendar__selector-icon"></i>
          </div>
        </div>
        <button class="calendar__nav calendar__nav-next"><i class="fa-solid fa-angle-right"></i></button>
      </div>

      <table class="calendar__dates">
        <thead>
          <tr class="calendar__week">
            <th class="calendar__date">Sun</th>
            <th class="calendar__date">Mon</th>
            <th class="calendar__date">Tue</th>
            <th class="calendar__date">Wed</th>
            <th class="calendar__date">Thu</th>
            <th class="calendar__date">Fri</th>
            <th class="calendar__date">Sat</th>
          </tr>
        </thead>
        <tbody class="calendar__date-body"></tbody>
      </table>

      <div class="calendar__current-date"></div>
      <div class="calendar__task-list"></div>
    `;

    this.yearSelect = this.container.querySelector(".calendar__select-year");
    this.monthSelect = this.container.querySelector(".calendar__select-month");
    this.prevBtn = this.container.querySelector(".calendar__nav-prev");
    this.nextBtn = this.container.querySelector(".calendar__nav-next");
    this.dateBody = this.container.querySelector(".calendar__date-body");
    this.tasksContainer = this.container.querySelector(".calendar__task-list");
    this.dateContainer = this.container.querySelector(
      ".calendar__current-date"
    );

    this._populateYearMonth();
    this._renderDates();
    this._bindEvents();

    // by default select today
    if (!this.selectedDate) {
      this._selectDate({
        year: this.today.getFullYear(),
        month: this.today.getMonth(),
        day: this.today.getDate(),
      });
    }
  }

  //populate the year/month that can be selected, the year range is +-10 years from this year
  _populateYearMonth() {
    const currentYear = this.today.getFullYear();
    this.yearSelect.innerHTML = "";
    this.monthSelect.innerHTML = "";

    for (let y = currentYear - 10; y <= currentYear + 10; y++) {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      this.yearSelect.appendChild(opt);
    }
    for (let m = 1; m <= 12; m++) {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      this.monthSelect.appendChild(opt);
    }

    this.yearSelect.value = this.year;
    this.monthSelect.value = this.month + 1;
  }

  //render the calendar date cells
  _renderDates() {
    const dates = this._generateDates();
    const dateTaskSet = taskStore.getTaskDateSet();
    this.dateBody.innerHTML = "";

    let index = 0;

    for (let week = 0; week < 6; week++) {
      const tr = document.createElement("tr");
      tr.classList.add("calendar__week");

      for (let day = 0; day < 7; day++) {
        const td = document.createElement("td");
        td.classList.add("calendar__date");

        const d = dates[index++];
        td.textContent = d.day;

        //data set of each cell
        td.dataset.year = d.year;
        td.dataset.month = d.month;
        td.dataset.day = d.day;

        if (dateTaskSet.has(parseDateToStr(new Date(d.year, d.month, d.day)))) {
          td.classList.add("calendar__date--has-task");
        }

        //if date is not in this month
        if (!d.currentMonth) td.classList.add("calendar__date--inactive");
        //if date is today
        if (
          d.currentMonth &&
          d.day === this.today.getDate() &&
          d.month === this.today.getMonth() &&
          d.year === this.today.getFullYear()
        )
          td.classList.add("calendar__date--today");

        //click to select a date
        td.addEventListener("click", () => this._selectDate(d));

        // highlight the selected date
        if (
          this.selectedDate &&
          this.selectedDate.getFullYear() === d.year &&
          this.selectedDate.getMonth() === d.month &&
          this.selectedDate.getDate() === d.day
        )
          td.classList.add("calendar__date--active");

        tr.appendChild(td);
      }

      this.dateBody.appendChild(tr);
    }
  }

  // call back for selecting the date, the dateObj is a Date object
  _selectDate(dateObj) {
    const newDate = new Date(dateObj.year, dateObj.month, dateObj.day);
    //selecting the same page
    if (
      this.selectedDate &&
      newDate.getTime() === this.selectedDate.getTime()
    ) {
      return;
    }
    this.selectedDate = newDate;
    this.year = dateObj.year;
    this.month = dateObj.month;

    this.yearSelect.value = this.year;
    this.monthSelect.value = this.month + 1;

    //after selecting the date, rerender the dates and the task list
    this._renderDates();
    this._renderTaskList();
  }

  //render the task list
  _renderTaskList() {
    if (!this.selectedDate) return;

    const y = this.selectedDate.getFullYear();
    const m = this.selectedDate.getMonth();
    const d = this.selectedDate.getDate();
    const date = new Date(y, m, d);

    this.dateContainer.textContent = `${y}-${m + 1}-${d}`;

    if (!this.taskList) {
      this.taskList = new TaskList(this.tasksContainer, { date });
    } else {
      this.taskList.setQuery({ date });
    }
  }

  //bind events
  _bindEvents() {
    this.prevBtn.addEventListener("click", () => this._changeMonth(-1));
    this.nextBtn.addEventListener("click", () => this._changeMonth(1));
    this.yearSelect.addEventListener("change", () => this._changeYearMonth());
    this.monthSelect.addEventListener("change", () => this._changeYearMonth());

    taskStore.addEventListener("updateTask", () => {
      this._renderDates();
    });

    taskStore.addEventListener("addTask", () => {
      this._renderDates();
    });

    taskStore.addEventListener("deleteTask", () => {
      this._renderDates();
    });
  }

  //change the month and year
  _changeMonth(offset) {
    let m = this.month + offset;
    let y = this.year;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    this.month = m;
    this.year = y;
    this.yearSelect.value = y;
    this.monthSelect.value = m + 1;

    this._renderDates();
    this._renderTaskList();
  }

  //change the month/year according to the select value in the header
  _changeYearMonth() {
    this.year = Number(this.yearSelect.value);
    this.month = Number(this.monthSelect.value) - 1;

    this._renderDates();
    this._renderTaskList();
  }
}
