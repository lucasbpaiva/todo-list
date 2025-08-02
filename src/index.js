import "./style.css";
import { displayList, createListSelector, displayListsFromStorage} from "./interface";

export class List {
    static allLists = [];

    constructor(listName, listId) {
        this.listName = listName;
        this.arrayOfTodos = [];
        this.id = listId !== undefined ? listId : crypto.randomUUID();
        List.allLists.push(this);
    }

    removeTodo(todo) {
        this.arrayOfTodos = this.arrayOfTodos.filter(item => item.id != todo.id); //remove from list
        allTodos.arrayOfTodos = allTodos.arrayOfTodos.filter(item => item.id != todo.id); //remove from list of all todos
    }

    addTodo(todo) {
        this.arrayOfTodos.push(todo);
        if (this != allTodos) allTodos.arrayOfTodos.push(todo);
    }

    static removeList(list) {
        List.allLists = List.allLists.filter(item => item.id != list.id);
    }
}

export class Todo {
    static allTodos = [];

    constructor(title, notes, dueDate, priority, listId = allTodos.id, todoId) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.listId = listId;
        this.id = todoId !== undefined ? todoId : crypto.randomUUID();
        Todo.allTodos.push(this);
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }

    setTodoTitle(title) {
        this.title = title;
    }

    setTodoNotes(notes) {
        this.notes = notes;
    }

    setTodoDueDate(dueDate) {
        this.dueDate = dueDate;
    }

    setPriority(priority) {
        this.priority = priority;
    }
}

export const allTodos = new List("All Todos");
createListSelector(allTodos);


if (!localStorage.getItem("allListIds")) {
    localStorage.setItem("allListIds", JSON.stringify(List.allLists.map(list => list.id)));

    const firstList = new List("First List");
    createListSelector(firstList);

    const item1 = new Todo("Brush teeth", "Don't forget to floss!", " 00:00:00", "High", firstList.id);
    const item2 = new Todo("Study for the tests", "Calculus and Linear Algebra", new Date("2025-08-15 00:00:00"), "Medium", firstList.id);
    const item3 = new Todo("Walk the dog", "", " 00:00:00", "High", firstList.id);

    const items = [item1, item2, item3];

    items.forEach(item => firstList.addTodo(item));
}
displayListsFromStorage();
displayList(allTodos);