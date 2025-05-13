import "../scss/style.scss"
import {TasksModel} from "./TasksModel.js";
import {FetchWrapper} from "./shared/FetchWrapper.js";

const taskInputElement = document.querySelector("#taskInput")
const formElement = document.querySelector("#form")
const tasksToDoListElement = document.querySelector("#tasksToDoList")
const tasksDoneListElement = document.querySelector("#tasksDoneList")
const containerElement = document.querySelector("#mainContainer")

const initialTasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : []

let {tasks, addTask, deleteTask, doneTask, getTasks} = new TasksModel(initialTasks)
const fetchWrapper = new FetchWrapper('https://73a95a8fb71c882b.mokky.dev')

getTasks().forEach(task => {
    renderTask(task);
})

tasks.subscribe((value) => {
    saveToLocalStorage("tasks", value)
})

formElement.addEventListener("submit", handleAddTask)
containerElement.addEventListener('click', handleDeleteTask)
containerElement.addEventListener('click', handleDoneTask)

function handleAddTask(e) {
    e.preventDefault()
    const taskTextInput = taskInputElement.value

    const newTask = {
        id: Date.now(),
        text: taskTextInput,
        done: false
    }
    addTask(newTask)

    renderTask(newTask)
    taskInputElement.value = ''
    taskInputElement.focus()

}

function handleDeleteTask(e) {
    if (e.target.dataset.action !== "delete") {
        return
    }

    const taskItem = e.target.closest(".list-group-item")
    const taskId = Number(taskItem.id)

    deleteTask(taskId)

    taskItem.remove()
}

function handleDoneTask(e) {
    if (e.target.dataset.action !== "done") {
        return
    }

    const taskItem = e.target.closest(".list-group-item")
    const taskId = Number(taskItem.id)

    const task = doneTask(taskId)
    taskItem.remove()

    taskItem.classList.toggle('list-group-item-done')
    renderTask(task)
}

function saveToLocalStorage(key, value) {
    localStorage.setItem("tasks", JSON.stringify(value))
}

function renderTask(task) {
    const taskHTML =  `
    <li id="${task.id}" class="list-group-item ${task.done ? "list-group-item-done" : ""}">
              <span class="task-title">${task.text}</span>
              <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                  <img src="/favicon/Check.svg" alt="Done" width="22" height="22">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                  <img src="/favicon/Trash.svg" alt="Done" width="22" height="22">
                </button>
              </div>
            </li>`
    const targetList = task.done ? tasksDoneListElement : tasksToDoListElement
    targetList.insertAdjacentHTML("afterbegin", taskHTML)
}

