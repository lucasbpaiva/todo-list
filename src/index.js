import "./style.css";
import deleteSVG from "./images/delete-icon.svg";

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
    item.appendChild(checkbox);

    checkbox.addEventListener("change", () => {
        todo.toggleCompleted();
    });

    const para = document.createElement("p");
    para.textContent = todo.title;
    item.appendChild(para);

    const deleteBtn = document.createElement("button");
    const deleteIcon = document.createElement("img");
    deleteIcon.src = deleteSVG;
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.classList.add("delete-btn");
    item.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
        container.removeChild(item);
        Todo.allTodos = Todo.allTodos.filter(item => item.id != todo.id);
    });

    container.appendChild(item);
}

const item1 = new Todo("Go to the gym", "", new Date(), "High");
createTodo(item1);

console.table(item1);

const form = document.querySelector(".todo-form");
const dialog = document.querySelector("dialog");
const addTodoBtn = document.querySelector(".addTodoBtn");
const confirmBtn = document.querySelector(".confirmBtn");
const cancelBtn = document.querySelector(".cancelBtn");

addTodoBtn.addEventListener("click", () => {
    dialog.showModal();
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
    dialog.close();
});

// "Cancel" button already closes the dialog without submitting because of [formmethod="dialog"]
cancelBtn.addEventListener("click", () => {
    form.reset();
});

dialog.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        confirmBtn.click();
    }
})