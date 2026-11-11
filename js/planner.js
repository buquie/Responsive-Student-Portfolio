// Academic Planner: add, edit, complete, delete and filter tasks.
// Tasks are saved in localStorage so they are still there after a refresh.

var STORAGE_KEY = "academicPlannerTasks";

// An array that stores all the tasks.
// Each task looks like: { id: 1, text: "Study", course: "CYB 101", due: "2025-12-01", done: false }
var tasks = [];
var editingId = null;      // id of the task being edited (null when adding)
var currentFilter = "all"; // "all", "active" or "done"

// Get the HTML elements we need
var taskForm = document.getElementById("taskForm");
var taskInput = document.getElementById("taskInput");
var courseInput = document.getElementById("courseInput");
var dueInput = document.getElementById("dueInput");
var addBtn = document.getElementById("addBtn");
var cancelBtn = document.getElementById("cancelBtn");
var taskList = document.getElementById("taskList");
var taskError = document.getElementById("taskError");
var taskSummary = document.getElementById("taskSummary");
var emptyMsg = document.getElementById("emptyMsg");
var formHeading = document.getElementById("formHeading");
var filterButtons = document.querySelectorAll(".filter-btn");

// Load tasks from localStorage (falls back to an empty list)
function loadTasks() {
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
      tasks = saved;
    }
  } catch (e) {
    tasks = [];
  }
}

// Save tasks to localStorage
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    // Storage may be unavailable (private mode); the planner still works for this visit.
  }
}

// Make a new unique id
function nextId() {
  var max = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id > max) {
      max = tasks[i].id;
    }
  }
  return max + 1;
}

// Find the position of a task in the array by id
function findIndex(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      return i;
    }
  }
  return -1;
}

// Check the form and return an error message ("" means valid)
function validate(text, due) {
  if (text === "") {
    return "Please type a task first.";
  }
  if (text.length < 3) {
    return "The task must be at least 3 characters long.";
  }
  if (due !== "" && isNaN(new Date(due).getTime())) {
    return "Please choose a valid due date.";
  }
  return "";
}

// Add a new task, or save changes when editing
function submitTask(event) {
  event.preventDefault();

  var text = taskInput.value.trim();
  var course = courseInput.value.trim();
  var due = dueInput.value;

  var message = validate(text, due);
  if (message !== "") {
    taskError.textContent = message;
    taskInput.focus();
    return;
  }
  taskError.textContent = "";

  if (editingId !== null) {
    var index = findIndex(editingId);
    if (index !== -1) {
      tasks[index].text = text;
      tasks[index].course = course;
      tasks[index].due = due;
    }
    stopEditing();
  } else {
    tasks.push({ id: nextId(), text: text, course: course, due: due, done: false });
    taskForm.reset();
  }

  saveTasks();
  showTasks();
  taskInput.focus();
}

// Mark a task as done (or not done)
function toggleTask(id) {
  var index = findIndex(id);
  if (index !== -1) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    showTasks();
  }
}

// Remove a task from the array
function deleteTask(id) {
  var index = findIndex(id);
  if (index === -1) {
    return;
  }
  tasks.splice(index, 1);
  if (editingId === id) {
    stopEditing();
  }
  saveTasks();
  showTasks();
}

// Put a task into the form so it can be changed
function startEditing(id) {
  var index = findIndex(id);
  if (index === -1) {
    return;
  }
  editingId = id;
  taskInput.value = tasks[index].text;
  courseInput.value = tasks[index].course || "";
  dueInput.value = tasks[index].due || "";
  addBtn.textContent = "Save Changes";
  formHeading.textContent = "Edit task";
  cancelBtn.hidden = false;
  taskError.textContent = "";
  taskInput.focus();
}

// Leave edit mode and reset the form
function stopEditing() {
  editingId = null;
  taskForm.reset();
  addBtn.textContent = "Add Task";
  formHeading.textContent = "Add a task";
  cancelBtn.hidden = true;
  taskError.textContent = "";
}

// Turn "2025-12-01" into a readable date
function formatDate(value) {
  var parts = value.split("-");
  var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// Is a pending task past its due date?
function isOverdue(task) {
  if (task.done || !task.due) {
    return false;
  }
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var parts = task.due.split("-");
  var due = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return due < today;
}

// Make a small button for a task
function makeButton(label, ariaLabel, onClick) {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.setAttribute("aria-label", ariaLabel);
  btn.addEventListener("click", onClick);
  return btn;
}

// Draw the whole list on the page
function showTasks() {
  taskList.innerHTML = ""; // clear the old list
  var shown = 0;

  tasks.forEach(function (task) {
    if (currentFilter === "active" && task.done) {
      return;
    }
    if (currentFilter === "done" && !task.done) {
      return;
    }
    shown++;

    var li = document.createElement("li");
    if (task.done) {
      li.className = "done";
    }

    var info = document.createElement("div");
    info.className = "task-info";

    var title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.text;
    info.appendChild(title);

    var details = [];
    if (task.course) {
      details.push(task.course);
    }
    if (task.due) {
      details.push("Due " + formatDate(task.due));
    }
    if (details.length > 0) {
      var meta = document.createElement("small");
      meta.className = "task-meta";
      meta.textContent = details.join(" | ");
      if (isOverdue(task)) {
        meta.textContent += " (overdue)";
        meta.classList.add("overdue");
      }
      info.appendChild(meta);
    }

    var actions = document.createElement("div");
    actions.className = "task-actions";
    actions.appendChild(makeButton(task.done ? "Undo" : "Done", (task.done ? "Mark as not done: " : "Mark as done: ") + task.text, function () {
      toggleTask(task.id);
    }));
    actions.appendChild(makeButton("Edit", "Edit task: " + task.text, function () {
      startEditing(task.id);
    }));
    actions.appendChild(makeButton("Delete", "Delete task: " + task.text, function () {
      deleteTask(task.id);
    }));

    li.appendChild(info);
    li.appendChild(actions);
    taskList.appendChild(li);
  });

  // Summary line and empty message
  var doneCount = tasks.filter(function (t) { return t.done; }).length;
  taskSummary.textContent = tasks.length + " task(s) in total, " + doneCount + " completed, " + (tasks.length - doneCount) + " pending.";
  emptyMsg.hidden = shown !== 0;
  if (shown === 0 && tasks.length > 0) {
    emptyMsg.textContent = "No tasks match this filter.";
  } else {
    emptyMsg.textContent = "No tasks yet. Add your first one above.";
  }
}

// Change which tasks are shown
function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(function (btn) {
    var isActive = btn.getAttribute("data-filter") === filter;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive);
  });
  showTasks();
}

// Event handlers
taskForm.addEventListener("submit", submitTask);
cancelBtn.addEventListener("click", stopEditing);
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    setFilter(btn.getAttribute("data-filter"));
  });
});

// Start up
loadTasks();
setFilter("all");
