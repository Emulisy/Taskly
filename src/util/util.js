function parseStrToDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function parseDateToStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function matchDate(task, date) {
  if (!task.endDate) return true;

  const d = new Date(date);
  const e = new Date(task.endDate);

  d.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);

  return d.getTime() === e.getTime();
}

function matchKeyword(task, keyword) {
  const k = keyword.toLowerCase();
  return (
    task.title.toLowerCase().includes(k) ||
    (task.description ?? "").toLowerCase().includes(k)
  );
}

export { parseDateToStr, parseStrToDate, matchDate, matchKeyword };
