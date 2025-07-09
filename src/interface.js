import { format } from "date-fns";
import { Todo } from "./index";

export function createTodo(todo) {
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

    const todoText = document.createElement("div");
    todoText.classList.add("todo-text");

    const para = document.createElement("p");
    para.textContent = todo.title;
    para.classList.add("todo-title");
    todoText.appendChild(para);

    if (todo.dueDate != " 00:00:00") {
        const datePara = document.createElement("p");
        const formattedDate = format(todo.dueDate, "dd/MM/yyyy");
        datePara.textContent = formattedDate;
        datePara.classList.add("date-text");
        todoText.appendChild(datePara);
    }

    item.appendChild(todoText);

    const deleteBtn = document.createElement("button");
    const deleteIcon = createDeleteIcon();
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.classList.add("delete-btn");
    item.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
        container.removeChild(item);
        Todo.removeTodo(todo);
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
    // Including a time component (yyyy-MM-dd 00:00:00), date-fns treats the string as local time, avoiding the UTC adjustment
    const dueDate = `${document.querySelector("#due-date").value} 00:00:00`;
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