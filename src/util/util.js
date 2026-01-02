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
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const start = task.startDate ? new Date(task.startDate) : null;
  const end = task.endDate ? new Date(task.endDate) : null;

  const s = start ? start.setHours(0, 0, 0, 0) : null;
  const e = end ? end.setHours(0, 0, 0, 0) : null;

  if (!s && !e) return true;
  if (!s) return d <= e;
  if (!e) return d >= s;
  return d >= s && d <= e;
}

function matchKeyword(task, keyword) {
  const k = keyword.toLowerCase();
  return (
    task.title.toLowerCase().includes(k) ||
    (task.description ?? "").toLowerCase().includes(k)
  );
}

export { parseDateToStr, parseStrToDate, matchDate, matchKeyword };
