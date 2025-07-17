import "./style.css";
import { format } from "date-fns";
import { displayTodo, displayList, switchLists} from "./interface";

export class List {
    static allLists = [];

    constructor(listName) {
        this.listName = listName;
        this.arrayOfTodos = [];
        this.id = crypto.randomUUID();
        List.allLists.push(this);
        // console.table(this);
    }

    static removeTodo(todo, list = allTodos) {
        list.arrayOfTodos = list.arrayOfTodos.filter(item => item.id != todo.id); //remove from list
        allTodos.arrayOfTodos = allTodos.arrayOfTodos.filter(item => item.id != todo.id); //remove from list of all todos
    }

    addTodo(todo) {
        this.arrayOfTodos.push(todo);
        if (this != allTodos) allTodos.arrayOfTodos.push(todo);
    }
}

export class Todo {
    static allTodos = [];

    constructor(title, notes, dueDate, priority, list = allTodos) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.list = list;
        this.id = crypto.randomUUID();
        Todo.allTodos.push(this);
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }

    setPriority(priority) {
        this.priority = priority;
    }

    // static removeTodo(todo) {
    //     Todo.allTodos = Todo.allTodos.filter(item => item.id != todo.id);
    // }
}

export const allTodos = new List("All Todos");
const allTodosLink = document.querySelector(".all-todos");
allTodosLink.dataset.listId = allTodos.id;

export const firstList = new List("First List");
const firstListLink = document.querySelector(".first-list");
firstListLink.dataset.listId = firstList.id;

const firstListItems = [
    new Todo("Brush teeth", "something something", " 00:00:00", "High", firstList),
    new Todo("Study for the test", "something something", new Date("2025-08-05 00:00:00"), "Medium", firstList),
    new Todo("Organize surprise party", "", new Date("2025-08-20 00:00:00"), "Low", firstList)
];

firstListItems.forEach(item => firstList.addTodo(item));

export const secondList = new List("My Other List");
const secondListLink = document.querySelector(".second-list");
secondListLink.dataset.listId = secondList.id;

const secondListItems = [
    new Todo("Buy Manga", "Chainsaw Man and Spy X Family", " 00:00:00", "Low", secondList),
    new Todo("Go to the gym", "get some more reps", new Date("2025-07-17 00:00:00"), "Medium", secondList),
    new Todo("Actually read the mangas", "someday", " 00:00:00", "High", secondList)
];

secondListItems.forEach(item => secondList.addTodo(item));

displayList(allTodos);

switchLists();