// ================= THEME (light/dark mode) =================
function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

initTheme();

const themeBtn = document.getElementById("theme-toggle");
if (themeBtn) themeBtn.addEventListener("click", toggleTheme);


// ================= LANDING PAGE ONLY =================
const getStartedBtn = document.getElementById("get-started-btn");

if (getStartedBtn) {
  const loadingOverlay = document.getElementById("loading-overlay");

  getStartedBtn.addEventListener("click", () => {
    loadingOverlay.classList.remove("hidden");
    setTimeout(() => {
   window.location.href = "index.html";
    }, 700);
  });
}


// ================= TODO PAGE ONLY =================
const taskList = document.getElementById("task-list");

if (taskList) {
  const taskInput = document.getElementById("task-input");
  const addBtn = document.getElementById("add-btn");
  const errorMsg = document.getElementById("error-msg");
  const taskCounter = document.getElementById("task-counter");
  const clearCompletedBtn = document.getElementById("clear-completed-btn");
  const backBtn = document.getElementById("back-btn");
  const loadingOverlay = document.getElementById("loading-overlay");
  const completionScreen = document.getElementById("completion-screen");
  const continueBtn = document.getElementById("continue-btn");
  const startOverBtn = document.getElementById("start-over-btn");

  let tasks = [];
  let wasAllDone = false;

  backBtn.addEventListener("click", () => {
    window.location.href = "landing.html";
  });

  function loadTasks() {
    const saved = localStorage.getItem("tasks");
    tasks = saved ? JSON.parse(saved) : [];
    tasks = tasks.filter((t) => t && t.id && t.text && t.text.trim() !== "");
    renderTasks();

    setTimeout(() => {
      loadingOverlay.classList.add("hidden");
    }, 400);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " completed" : "");

      li.innerHTML = `
        <span class="task-text"></span>
        <button class="complete-btn" data-id="${task.id}" title="Toggle complete">✓</button>
        <button class="delete-btn" data-id="${task.id}" title="Delete task">🗑️</button>
      `;
      li.querySelector(".task-text").textContent = task.text;

      taskList.appendChild(li);
    });

    updateTaskCounter();
    checkAllDone();
  }

  function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
      errorMsg.textContent = "Please enter a task before adding.";
      return;
    }

    errorMsg.textContent = "";

    tasks.push({ id: Date.now(), text: text, completed: false });
    wasAllDone = false;

    taskInput.value = "";
    saveTasks();
    renderTasks();
    taskInput.focus();
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }

  function clearCompleted() {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    renderTasks();
  }

  function updateTaskCounter() {
    const remaining = tasks.filter((t) => !t.completed).length;

    if (tasks.length === 0) {
      taskCounter.textContent = "No tasks yet";
    } else if (remaining === 0) {
      taskCounter.textContent = "All tasks completed!";
    } else if (remaining === 1) {
      taskCounter.textContent = "1 task remaining";
    } else {
      taskCounter.textContent = `${remaining} tasks remaining`;
    }
  }

  function checkAllDone() {
    const allDone = tasks.length > 0 && tasks.every((t) => t.completed);

    if (allDone && !wasAllDone) {
      completionScreen.classList.remove("hidden");
    }
    wasAllDone = allDone;
  }

  addBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });

  taskList.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains("complete-btn")) toggleTask(id);
    if (e.target.classList.contains("delete-btn")) deleteTask(id);
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);

  continueBtn.addEventListener("click", () => {
    completionScreen.classList.add("hidden");
  });

  startOverBtn.addEventListener("click", () => {
    tasks = [];
    wasAllDone = false;
    saveTasks();
    renderTasks();
    completionScreen.classList.add("hidden");
  });

  loadTasks();
}
