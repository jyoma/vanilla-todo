const todoList = {
  /**
   * @type {string[]}
   */
  value: [],

  /**
   * @type {null | number}
   */
  editingIndex: null,
};

document.addEventListener("DOMContentLoaded", bootstrap);

async function bootstrap() {
  const TodoForm = document.getElementById("todo-form");
  const TodoInput = _TodoInput();
  const CancelEditingBtn = _CancelEditingBtn();

  todoList.value = getPersistedTodoList();
  updateUi();

  TodoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = TodoInput.value;

    setTodoInputValue("");

    if (todoList.editingIndex !== null) {
      updateTodo(todoList.editingIndex, text);
      return;
    }

    addTodo(text);
  });

  CancelEditingBtn.addEventListener("click", () => {
    if (todoList.editingIndex === null) {
      return;
    }

    todoList.editingIndex = null;
    updateUi();
    setTodoInputValue("");
  });
}

function _TodoList() {
  return document.getElementById("todo-list");
}

/**
 *
 * @returns {HTMLInputElement | null}
 */
function _TodoInput() {
  return document.getElementById("todo-input");
}

/**
 *
 * @returns {HTMLButtonElement | null}
 */
function _CancelEditingBtn() {
  return document.getElementById("cancel-editing");
}

function _TodoListItem(text, index, todoList) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const removeBtn = document.createElement("button");
  const editBtn = document.createElement("button");

  const listComponents = [span];

  removeBtn.textContent = "x";
  removeBtn.addEventListener("click", () => {
    removeTodo(index);
  });
  editBtn.textContent = "e";
  editBtn.addEventListener("click", () => {
    startEditingTodo(index);
  });
  span.textContent = text;

  // only show action buttons when we're not editing
  if (!todoList || todoList.editingIndex === null) {
    listComponents.push(editBtn, removeBtn);
  }

  li.append(...listComponents);
  li.classList.add("todo-list__item");

  if (todoList && todoList.editingIndex === index) {
    li.classList.add("todo-list__item--editing");
  }

  return li;
}

function startEditingTodo(index) {
  todoList.editingIndex = index;
  updateUi();
}

function clearTodoList() {
  const TodoList = _TodoList();

  TodoList.innerHTML = "";
}

function addTodo(text) {
  todoList.value.push(text);
  persistTodoList();
}

function updateTodo(index, text) {
  todoList.value.splice(index, 1, text);
  todoList.editingIndex = null;
  persistTodoList();
}

function removeTodo(index) {
  todoList.value.splice(index, 1);
  persistTodoList();
}

function clearTodo() {
  todoList.value = [];
  persistTodoList();
}

function persistTodoList() {
  localStorage.setItem("todos", JSON.stringify(todoList.value));
  updateUi();
}

function getPersistedTodoList() {
  const list = localStorage.getItem("todos");

  if (!list) {
    return [];
  }

  return JSON.parse(list);
}

function updateUi() {
  const CancelEditingBtn = _CancelEditingBtn();
  renderTodoList();
  const { editingIndex } = todoList;

  if (editingIndex !== null) {
    setTodoInputValue(todoList.value[editingIndex]);
  }

  CancelEditingBtn.style.display = editingIndex === null ? "none" : "";
}

function renderTodoList() {
  const TodoList = _TodoList();
  TodoList.innerHTML = "";

  TodoList.append(
    ...todoList.value.map((item, index) => _TodoListItem(item, index, todoList))
  );
}

function setTodoInputValue(text) {
  const TodoInput = _TodoInput();

  TodoInput.value = text;
  TodoInput.focus();
}
