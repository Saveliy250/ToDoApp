import "../scss/style.scss"
import {TasksModel} from "./TaskList/TasksModel.js";
import {TaskRepository} from "./TaskList/TaskRepository.js";
const taskInputElement = document.querySelector("#taskInput")
const formElement = document.querySelector("#form")
const tasksToDoListElement = document.querySelector("#tasksToDoList")
const tasksDoneListElement = document.querySelector("#tasksDoneList")
const containerElement = document.querySelector("#mainContainer")
const errorElement = document.querySelector(".error")

let initialTasks = []

const taskRepository = new TaskRepository()

if (localStorage.getItem("tasks") && localStorage.getItem("tasks") !== "[]") {
    initialTasks = JSON.parse(localStorage.getItem("tasks"))
} else {
    try {
        initialTasks = await taskRepository.getTasksFromServer()
        saveToLocalStorage("tasks",initialTasks)
    } catch (error) {
        errorElement.innerHTML = "Не удалось получить данные о задачах"
    }
}


let {tasks, addTask, deleteTask, doneTask, getTasks, getTaskById} = new TasksModel(initialTasks)


getTasks().forEach(task => {
    renderTask(task);
})

tasks.subscribe((value) => {
    saveToLocalStorage("tasks", value)
})

formElement.addEventListener("submit", handleAddTask)
containerElement.addEventListener('click', handleDeleteTask)
containerElement.addEventListener('click', handleDoneTask)

async function handleAddTask(e) {
    e.preventDefault()
    const taskTextInput = taskInputElement.value

    const newTask = {
        text: taskTextInput,
        done: false
    }
    try {
        const task = await taskRepository.addTask(newTask)
        addTask(task)
        renderTask(task)
        taskInputElement.value = ''
        taskInputElement.focus()
    } catch (error) {
        errorElement.innerHTML = "Не удалось добавить задачу"
    }
}

async function handleDeleteTask(e) {
    if (e.target.dataset.action !== "delete") {
        return
    }

    const taskItem = e.target.closest(".list-group-item")
    const taskId = Number(taskItem.id)
    try {
        const response = await taskRepository.deleteTask(taskId)
        deleteTask(taskId)
        taskItem.remove()
    } catch (error) {
        errorElement.innerHTML = "Не удалось удалить задачу"
    }
}

async function handleDoneTask(e) {
    if (e.target.dataset.action !== "done") {
        return
    }

    const taskItem = e.target.closest(".list-group-item")
    const taskId = Number(taskItem.id)
    const task = getTaskById(taskId)
    try {
        const taskNew = await taskRepository.patchTask({
            "done": !task.done
        }, taskId)
        doneTask(taskId)
        taskItem.remove()

        taskItem.classList.toggle('list-group-item-done')
        renderTask(taskNew)
    } catch (error) {
        errorElement.innerHTML = "Не удалось изменить статус задачи"
    }

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

