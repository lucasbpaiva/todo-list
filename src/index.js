import "./style.css";

class Todo {
    static allTodos = [];

    constructor(title, notes, dueDate, priority) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.id = crypto.randomUUID();
        Todo.allTodos.push(this);
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }
}

function createTodo(todo) {
    const container = document.querySelector(".container");

    const item = document.createElement("div");
    item.classList.add("item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("custom-checkbox");
    item.appendChild(checkbox);

    checkbox.addEventListener("change", () => {
        todo.toggleCompleted();
    });

    const para = document.createElement("p");
    para.textContent = todo.title;
    para.classList.add("todo-text");
    item.appendChild(para);

    const deleteBtn = document.createElement("button");
    const deleteIcon = createDeleteIcon();
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.classList.add("delete-btn");
    item.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
        container.removeChild(item);
        Todo.allTodos = Todo.allTodos.filter(item => item.id != todo.id);
    });

    container.appendChild(item);
}

function createDeleteIcon() {
    const svgNS = "http://www.w3.org/2000/svg"
    const deleteIcon = document.createElementNS(svgNS, "svg");
    deleteIcon.setAttribute("height", "24px");
    deleteIcon.setAttribute("width", "24px");
    deleteIcon.setAttribute("viewBox", "0 -960 960 960");
    deleteIcon.setAttribute("fill", "var(--secondary-color)");
    const deletePath = document.createElementNS(svgNS, "path");
    deletePath.setAttribute("d", "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z");
    deleteIcon.appendChild(deletePath);

    return deleteIcon;
}

const item1 = new Todo("Go to the gym", "", new Date(), "High");
createTodo(item1);
const item2 = new Todo("Study for the test", "", new Date("2025-07-06"), "High");
createTodo(item2);

console.table(item1);
console.table(item2);

const form = document.querySelector(".todo-form");
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");
const addTodoBtn = document.querySelector(".addTodoBtn");
const todoTitle = document.querySelector("#todo-title");
const confirmBtn = document.querySelector(".confirmBtn");
const cancelBtn = document.querySelector(".cancelBtn");

function toggleModal() {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
}

addTodoBtn.addEventListener("click", () => {
    toggleModal();
    todoTitle.focus();
});

confirmBtn.addEventListener("click", (event) => {
    event.preventDefault(); //  Prevent the "confirm" button from the default behavior of submitting the form

    const title = document.querySelector("#todo-title").value;
    const notes = document.querySelector("#todo-notes").value;
    const dueDate = document.querySelector("#due-date").value;
    const priority = document.querySelector("#priority").value;

    const todo = new Todo(title, notes, dueDate, priority);
    createTodo(todo);

    form.reset(); //reset form input fields
    toggleModal();
});

// "Cancel" button already closes the modal without submitting because of [formmethod="modal"]
cancelBtn.addEventListener("click", () => {
    form.reset();
    toggleModal();
});

modal.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        confirmBtn.click();
    }
})

modal.addEventListener("keydown", (event) => {
    // Using keydown as in some browsers the keypress event is only fired if the key outputs a character
    if (event.key === "Escape") {
        form.reset();
        toggleModal();
    }
})