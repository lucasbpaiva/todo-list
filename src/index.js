import "./style.css";
import { format } from "date-fns";
import { createTodo } from "./interface";

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

    static removeTodo(todo) {
        Todo.allTodos = Todo.allTodos.filter(item => item.id != todo.id);
    }
}

const item1 = new Todo("Go to the gym", "", new Date("2025-07-11 00:00:00"), "High");
createTodo(item1);
const item2 = new Todo("Study for the test", "", new Date("2025-07-14 00:00:00"), "Medium");
createTodo(item2);
const item3 = new Todo("Organize surprise party", "", new Date("2025-07-22 00:00:00"), "Low");
createTodo(item3);

console.table(item1);
console.table(item2);
console.table(item3);