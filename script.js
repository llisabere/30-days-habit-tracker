const grid = document.getElementById("grid");
const startDateInput = document.getElementById("startDate");
const resetButton = document.getElementById("resetButton");
const goal = document.getElementById("goal");

// const rootStyles = getComputedStyle(document.documentElement);

// const success = rootStyles.getPropertyValue("--success");
// const missed = rootStyles.getPropertyValue("--missed");

const totalDays = 30;
let cells = [];

function buildGrid() {
  grid.innerHTML = "";

  const startDateValue = startDateInput.value;
  const startDate = startDateValue ? new Date(startDateValue) : null;

  for (let i = 1; i <= totalDays; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = i;
    cell.dataset.state = "0";

    if (startDate && i % 5 === 0) {
      const dateLabel = document.createElement("span");
      dateLabel.classList.add("date-label");

      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (i - 1));

      dateLabel.textContent = `${date.getDate() + 1}`; // ${date.getDate()}/${date.getMonth() + 1}`
      cell.appendChild(dateLabel);
    }

    grid.appendChild(cell);
  }

  // 🔑 IMPORTANT
  cells = document.querySelectorAll(".cell");
}

function attachCellListeners() {
  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      let state = cell.dataset.state;

      if (state === "0") {
        // cell.style.backgroundColor = success;
        cell.classList.add("success");
        cell.dataset.state = "1";
      } else if (state === "1") {
        // cell.style.backgroundColor = missed;
        cell.classList.add("missed");
        cell.dataset.state = "2";
      } else {
        cell.classList.remove("success", "missed");
        cell.dataset.state = "0";
      }

      saveState();
    });
  });
}

function saveState() {
  const states = [];
  cells.forEach(cell => states.push(cell.dataset.state));
  localStorage.setItem("habitStates", JSON.stringify(states));
}

function restoreState() {
  const savedStates = JSON.parse(localStorage.getItem("habitStates"));
  if (!savedStates) return;

  cells.forEach((cell, index) => {
    const state = savedStates[index];
    cell.dataset.state = state;

    if (state === "1") cell.classList.add("success"); //cell.style.backgroundColor = success;
    if (state === "2") cell.classList.add("missed"); //cell.style.backgroundColor = missed;
  });
}

function restoreGoal() {
  goal.value = localStorage.getItem("habitGoal") || "";
}

function saveGoal() {
  goal.addEventListener("input", () => {
    localStorage.setItem("habitGoal", goal.value);
  });
}

function highlightToday() {
  const startDateValue = startDateInput.value;
  if (!startDateValue) return;

  const startDate = new Date(startDateValue);
  const today = new Date();

  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const dayIndex = Math.floor(
    (today - startDate) / (1000 * 60 * 60 * 24)
  );

  if (dayIndex >= 0 && dayIndex < totalDays) {
    cells[dayIndex].classList.add("today");
  }
}

const savedStartDate = localStorage.getItem("startDate");
if (savedStartDate) startDateInput.value = savedStartDate;

startDateInput.addEventListener("change", () => {
  localStorage.setItem("startDate", startDateInput.value);
  init();
});

resetButton.addEventListener("click", () => {
  if (!confirm("Reset all data?")) return;

  localStorage.clear();
  goal.value = "";
  startDateInput.value = "";

  init();
});

const darkToggle = document.getElementById("darkToggle");

// load saved preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  darkToggle.checked = true;
}

// toggle on change
darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// default to system preference if no saved preference
if (!savedTheme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    document.body.classList.add("dark");
    darkToggle.checked = true;
  }
}

function init() {
  buildGrid();
  attachCellListeners();
  restoreState();
  restoreGoal();
  saveGoal();
  highlightToday();
}

init();