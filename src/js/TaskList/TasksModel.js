import {Observable} from "../shared/Observable.js";

export class TasksModel {
    constructor(initialValue) {
        this.tasks = new Observable(initialValue);
    }

    getTasks = () => {
      return this.tasks.value;
    }
    getTaskById = (id) => {
        return this.tasks.value.find(task => task.id === id)
    }
    addTask = (newTask) => {
        this.tasks.value.push(newTask)
        this.tasks.notify()
    }

    deleteTask = (taskId) => {
        this.tasks.value = this.tasks.value.filter(task => task.id !== taskId)
        this.tasks.notify()
    }

    doneTask = (taskId) => {
        const task = this.tasks.value.find(task => task.id === taskId)
        task.done = !task.done
        this.tasks.notify()
        return task
    }
}