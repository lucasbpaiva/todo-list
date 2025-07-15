import "./style.css";
import { format } from "date-fns";
import { createTodo, displayList } from "./interface";

export class Todo {
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

    setPriority(priority) {
        this.priority = priority;
    }

    static removeTodo(todo) {
        Todo.allTodos = Todo.allTodos.filter(item => item.id != todo.id);
    }
}

displayList("All Todos");

const item1 = new Todo("Brush teeth", "something something", " 00:00:00", "High");
createTodo(item1);
const item2 = new Todo("Study for the test", "something something", new Date("2025-08-05 00:00:00"), "Medium");
createTodo(item2);
const item3 = new Todo("Organize surprise party", "", new Date("2025-08-20 00:00:00"), "Low");
createTodo(item3);

console.table(item1);
console.table(item2);
console.table(item3);