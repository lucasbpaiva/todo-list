import "./style.css";
import { displayList, createListSelector} from "./interface";

export class List {
    static allLists = [];

    constructor(listName) {
        this.listName = listName;
        this.arrayOfTodos = [];
        this.id = crypto.randomUUID();
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

    constructor(title, notes, dueDate, priority, listId = allTodos.id) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.listId = listId;
        this.id = crypto.randomUUID();
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

const firstList = new List("First List");
createListSelector(firstList);

const firstListItems = [
    new Todo("Brush teeth", "something something", " 00:00:00", "High", firstList.id),
    new Todo("Study for the test", "something something", new Date("2025-08-05 00:00:00"), "Medium", firstList.id),
    new Todo("Organize surprise party", "", new Date("2025-08-20 00:00:00"), "Low", firstList.id)
];

firstListItems.forEach(item => firstList.addTodo(item));

const secondList = new List("My Other List");
createListSelector(secondList);

const secondListItems = [
    new Todo("Buy Manga", "Chainsaw Man and Spy X Family", " 00:00:00", "Low", secondList.id),
    new Todo("Go to the gym", "get some more reps", new Date("2025-07-17 00:00:00"), "Medium", secondList.id),
    new Todo("Actually read the mangas", "someday", " 00:00:00", "High", secondList.id)
];

secondListItems.forEach(item => secondList.addTodo(item));

displayList(allTodos);