let data = JSON.parse(localStorage.getItem("tasks")) || [];
let currentEditId = null;

// SAVE
function save() {
  localStorage.setItem("tasks", JSON.stringify(data));
}

// LOAD
window.onload = function () {
  data.forEach(task => renderTask(task));
  updateStats();
};

// ADD TASK
function addTask() {
  const input = document.getElementById("taskInput");

  if (!input.value.trim()) return;

  const task = {
    id: Date.now().toString(),
    text: input.value,
    status: "open"
  };

  data.push(task);
  save();

  renderTask(task);
  updateStats();

  input.value = "";
}

// RENDER TASK
function renderTask(task) {
  const div = document.createElement("div");
  div.className = "task";
  div.id = task.id;
  div.draggable = true;

  div.innerHTML = `
    <span>${task.text}</span>
    <div class="actions">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  // EDIT
  div.querySelector(".edit-btn").onclick = function () {
    openModal(task.id);
  };

  // DELETE
  div.querySelector(".delete-btn").onclick = function () {
    data = data.filter(t => t.id !== task.id);
    save();
    reload();
  };

  div.addEventListener("dragstart", drag);

  document.getElementById(task.status).appendChild(div);
}

// MODAL OPEN
function openModal(id) {
  const task = data.find(t => t.id === id);
  document.getElementById("modal").style.display = "flex";
  document.getElementById("editInput").value = task.text;
  currentEditId = id;
}

// SAVE EDIT
function saveEdit() {
  const value = document.getElementById("editInput").value;
  if (!value) return;

  const task = data.find(t => t.id === currentEditId);
  task.text = value;

  save();
  reload();
  closeModal();
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// DRAG
function drag(ev) {
  ev.dataTransfer.setData("id", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();

  const id = ev.dataTransfer.getData("id");
  const taskEl = document.getElementById(id);

  ev.currentTarget.appendChild(taskEl);

  const item = data.find(t => t.id === id);
  if (item) item.status = ev.currentTarget.id;

  save();
  updateStats();
}

// RELOAD
function reload() {
  document.querySelectorAll(".column").forEach(col => {
    col.innerHTML = "<h3>" + col.id + "</h3>";
  });

  data.forEach(task => renderTask(task));
  updateStats();
}

// STATS
function updateStats() {
  document.getElementById("count-open").innerText =
    data.filter(t => t.status === "open").length;

  document.getElementById("count-progress").innerText =
    data.filter(t => t.status === "progress").length;

  document.getElementById("count-testing").innerText =
    data.filter(t => t.status === "testing").length;

  document.getElementById("count-done").innerText =
    data.filter(t => t.status === "done").length;
}

// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}