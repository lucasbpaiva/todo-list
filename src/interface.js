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

    const priorityBtn = document.createElement("button");
    const priorityIcon = createPriorityIcon();
    priorityBtn.appendChild(priorityIcon);
    priorityBtn.classList.add("priority-btn");
    priorityBtn.classList.add(`${todo.priority}`);
    item.appendChild(priorityBtn);

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

function createPriorityIcon() {
    const svgNS = "http://www.w3.org/2000/svg"
    const priorityIcon = document.createElementNS(svgNS, "svg");
    priorityIcon.setAttribute("height", "24px");
    priorityIcon.setAttribute("width", "24px");
    priorityIcon.setAttribute("viewBox", "-25.6 -25.6 307.20 307.20");
    priorityIcon.setAttribute("fill", "var(--secondary-color)");
    priorityIcon.setAttribute("transform", "rotate(0)");

    const strokeWidth = document.createElementNS(svgNS, "g");
    strokeWidth.setAttribute("stroke-width", "0");
    priorityIcon.appendChild(strokeWidth);

    const tracer = document.createElementNS(svgNS, "g");
    tracer.setAttribute("stroke-linecap", "round");
    tracer.setAttribute("stroke-linejoin", "round");
    priorityIcon.appendChild(tracer);

    const priorityPath = document.createElementNS(svgNS, "path");
    priorityPath.setAttribute("d", "M223.99951,48.00452v120a8.00094,8.00094,0,0,1-3.20019,6.40039c-15.14161,11.35547-29.62012,15.42773-43.42871,15.42773-18.74707.001-36.25879-7.50488-52.52247-14.47461-26.7124-11.449-49.92529-21.38183-76.84863-3.21924v43.86573a8,8,0,0,1-16,0v-168c0-.05616.00733-.11036.0083-.16651.00342-.14624.01123-.292.022-.43774.00976-.126.0205-.251.03564-.37525.01562-.12622.03613-.25122.05762-.37646.02343-.13794.04834-.27539.07861-.41065.02539-.11206.05566-.22241.08594-.33325.03808-.14038.07666-.28.12207-.417.03662-.1106.07861-.21948.12012-.32861.04931-.12915.09863-.2583.15429-.38428.05225-.1189.11133-.23511.16944-.35181.05517-.1101.10986-.22021.16992-.32715.07031-.126.14746-.248.22461-.37036.05957-.0935.11767-.18725.18115-.27807.085-.123.17676-.24219.26953-.36084.06738-.08618.13428-.17237.20508-.25586.09326-.10987.19189-.21582.292-.32129.0835-.08814.16748-.17529.25488-.25952.09375-.09058.1919-.178.291-.26465.106-.09253.21289-.18237.32373-.26929.0459-.03613.08691-.07641.13428-.11181,35.69629-26.77247,67.707-13.05762,95.95117-.95313,27.7666,11.90039,51.749,22.17871,80.04883.95313a8.00012,8.00012,0,0,1,12.7998,6.40039Z");
    priorityIcon.appendChild(priorityPath);

    return priorityIcon;
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