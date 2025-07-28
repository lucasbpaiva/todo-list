import { format } from "date-fns";
import { Todo, List} from "./index";
import { Popover } from "bootstrap";
import { allTodos } from "./index";

//allow buttons in bootstrap popover
Popover.Default.allowList.button = [];

function clearDivContents(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

export function displayList(todoList) {
    const mainContent = document.querySelector(".main-content");
    clearDivContents(mainContent);

    const listHeader = document.createElement("h1");
    listHeader.textContent = todoList.listName;

    const addTodoBtn = document.createElement("button");
    addTodoBtn.textContent = "+ Add Todo";
    addTodoBtn.classList.add("add-todo-btn");

    addTodoBtn.addEventListener("click", () => {
        toggleModal(todoModal);
        document.querySelector("#todo-title").focus();
    });

    const container = document.createElement("div");
    container.classList.add("container");
    container.dataset.listId = todoList.id;

    mainContent.append(listHeader, addTodoBtn, container);

    todoList.arrayOfTodos.forEach(displayTodo);

    const currentSelected = document.querySelector(".list-selected");
    if (currentSelected) currentSelected.classList.remove("list-selected");
    const listSelector = document.querySelector(`div[data-list-id="${todoList.id}"]`);
    listSelector.classList.add("list-selected");

if (todoList.id !== allTodos.id) {
    const deleteListPara = document.createElement("button");
    deleteListPara.textContent = "Delete List";
    deleteListPara.classList.add("delete-list-btn");
    mainContent.appendChild(deleteListPara);

    deleteListPara.addEventListener("click", () => {
        for (const todo of todoList.arrayOfTodos) {
            todoList.removeTodo(todo);
        }
        listSelector.remove();//remove list selector
        List.removeList(todoList); //remove list
        displayList(allTodos);
    });
}
}

export function displayTodo(todo) {
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

    const notesPara = document.createElement("p");
    notesPara.textContent = todo.notes;
    notesPara.classList.add("notes-text");
    todoText.appendChild(notesPara);

    if (todo.dueDate != " 00:00:00") {
        const datePara = document.createElement("p");
        const formattedDate = format(todo.dueDate, "dd/MM/yyyy");
        datePara.textContent = formattedDate;
        datePara.classList.add("date-text");
        todoText.appendChild(datePara);
    }

    item.appendChild(todoText);
    if (todo.completed === true) checkbox.checked = true;

    const priorityBtn = document.createElement("button");
    const priorityIcon = createPriorityIcon();
    priorityBtn.appendChild(priorityIcon);
    priorityBtn.classList.add("priority-btn");
    priorityBtn.classList.add(`${todo.priority}`);
    item.appendChild(priorityBtn);

    const popover = new Popover(priorityBtn, {
        container: item,
        content: '<div class="priority-popover"><button class="set-p1-btn set-priority-btn">High</button><button class="set-p2-btn set-priority-btn">Medium</button><button class="set-p3-btn set-priority-btn">Low</button><button class="set-pNone-btn set-priority-btn">None</button></div>', 
        html: true, 
        placement: "left",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-body"></div></div>',
        trigger: 'click'
    });

    //because the popover is dinamically created when the flag is clicked we need to set the event listener in the item div which was specified as the container in the popover creation 
    item.addEventListener("click", function(event) {
        if (event.target.matches(".set-p1-btn")) {
            todo.setPriority("High");
            priorityBtn.classList.remove("Medium", "Low", "None");
            priorityBtn.classList.add("High");
            popover.hide();
        }
        if (event.target.matches(".set-p2-btn")) {
            todo.setPriority("Medium");
            priorityBtn.classList.remove("High", "Low", "None");
            priorityBtn.classList.add("Medium");
            popover.hide();
        }
        if (event.target.matches(".set-p3-btn")) {
            todo.setPriority("Low");
            priorityBtn.classList.remove("High", "Medium", "None");
            priorityBtn.classList.add("Low");
            popover.hide();
        }
        if (event.target.matches(".set-pNone-btn")) {
            todo.setPriority("None");
            priorityBtn.classList.remove("High", "Medium", "Low");
            priorityBtn.classList.add("None");
            popover.hide();
        }
    });

    document.body.addEventListener("click", (event) => {
        //Returns the first (starting at element) inclusive ancestor that matches selectors, and null otherwise.
        const inPopover = event.target.closest(".popover");
        if (!inPopover) {
            popover.hide();
        }
    });

    const deleteBtn = document.createElement("button");
    const deleteIcon = createDeleteIcon();
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.classList.add("delete-btn");
    item.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
        container.removeChild(item);
        todo.list.removeTodo(todo);
    });

    container.appendChild(item);
}

function createTodo() {
    const title = document.querySelector("#todo-title").value;
    const notes = document.querySelector("#todo-notes").value;
    // Including a time component (yyyy-MM-dd 00:00:00), date-fns treats the string as local time, avoiding the UTC adjustment
    const dueDate = `${document.querySelector("#due-date").value} 00:00:00`;
    const priority = document.querySelector("#priority").value;
    const listId = document.querySelector(".container").dataset.listId;
    const list = List.allLists.find(list => list.id == listId);
    const todo = new Todo(title, notes, dueDate, priority, list); //create todo object
    list.addTodo(todo); //add todo to the list object

    return todo;
}

export function createListSelector(list) {
    const listName = document.createElement("p");
    listName.textContent = list.listName;

    const lists = document.querySelector(".lists");
    const listSelector = document.createElement("div");
    listSelector.classList.add("list-selector");
    listSelector.appendChild(listName);
    listSelector.dataset.listId = list.id;
    lists.appendChild(listSelector);

    listSelector.addEventListener("click", () => {
        const listId = listSelector.dataset.listId;
        const list = List.allLists.find(list => list.id == listId);
        displayList(list);
    });
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

const todoForm = document.querySelector(".todo-form");
const todoModal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");
const confirmBtn = document.querySelector(".confirmBtn");
const cancelBtn = document.querySelector(".cancelBtn");

function toggleModal(modal) {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
}

confirmBtn.addEventListener("click", (event) => {
    event.preventDefault(); //  Prevent the "confirm" button from the default behavior of submitting the form
    const todoTitleInput = document.querySelector("#todo-title");
    if (todoTitleInput.value !== "") {
        const todo = createTodo();
        displayTodo(todo);
        todoForm.reset(); //reset form input fields
        toggleModal(todoModal);
    } else {
        alert("Todo not created. You must enter a title for your todo!");
        todoTitleInput.focus();
    }
});

// "Cancel" button already closes the modal without submitting because of [formmethod="modal"]
cancelBtn.addEventListener("click", () => {
    todoForm.reset();
    toggleModal(todoModal);
});

todoModal.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && document.activeElement !== document.querySelector("#todo-notes")) {
        event.preventDefault();
        confirmBtn.click();
    }
});

todoModal.addEventListener("keydown", (event) => {
    // Using keydown as in some browsers the keypress event is only fired if the key outputs a character
    if (event.key === "Escape") {
        todoForm.reset();
        toggleModal(todoModal);
    }
});

const listModal = document.querySelector(".list-modal");
const listForm = document.querySelector(".list-form");
const listConfirmBtn = document.querySelector(".list-confirm-btn");
const listCancelBtn = document.querySelector(".list-cancel-btn");
const addListBtn = document.querySelector(".add-list-btn");

addListBtn.addEventListener("click", () => {
    toggleModal(listModal);
    document.querySelector("#list-name").focus();
});

listConfirmBtn.addEventListener("click", (event) => {
    event.preventDefault(); //  Prevent the "confirm" button from the default behavior of submitting the form
    const listNameInput = document.querySelector("#list-name");
    if (listNameInput.value !== "") {
        const list = new List(listNameInput.value);
        createListSelector(list);
        displayList(list);
        listForm.reset(); //reset form input fields
        toggleModal(listModal);
    } else {
        alert("List not created. You must enter a name for the list!");
        listNameInput.focus();
    }
});

// "Cancel" button already closes the modal without submitting because of [formmethod="modal"]
listCancelBtn.addEventListener("click", () => {
    listForm.reset();
    toggleModal(listModal);
});

listModal.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        listConfirmBtn.click();
    }
});

listModal.addEventListener("keydown", (event) => {
    // Using keydown as in some browsers the keypress event is only fired if the key outputs a character
    if (event.key === "Escape") {
        listForm.reset();
        toggleModal(listModal);
    }
});