import "../scss/style.scss"

const taskInputElement = document.querySelector("#taskInput")
const formElement = document.querySelector("#form")
const tasksToDoListElement = document.querySelector("#tasksToDoList")
const tasksDoneListElement = document.querySelector("#tasksDoneList")

let tasks = []
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(task => {
    renderTask(task);
})

formElement.addEventListener("submit", addTask)
document.addEventListener('click', deleteTask)
document.addEventListener('click', doneTask)
function addTask(e) {
    e.preventDefault()

    const taskTextInput = taskInputElement.value

    const newTask = {
        id: Date.now(),
        text: taskTextInput,
        done: false
    }
    tasks.push(newTask)
    // postTask(newTask)

    saveToLocalStorage()

    renderTask(newTask)

    taskInputElement.value = ''
    taskInputElement.focus()
}

function deleteTask(e) {
    if (e.target.dataset.action !== "delete") {
        return
    }
    const parentElement = e.target.closest(".list-group-item")
    const taskId = Number(parentElement.id)

    tasks = tasks.filter(task => task.id !== taskId)

    //deleteFromServer()
    saveToLocalStorage()
    parentElement.remove()
}

function doneTask(e) {
    if (e.target.dataset.action !== "done") {
        return
    }

    const parentElement = e.target.closest(".list-group-item")
    const taskId = Number(parentElement.id)
    const task = tasks.find(task => task.id === taskId)
    console.log(task.done)
    task.done = !task.done
    saveToLocalStorage()
    parentElement.remove()
    renderTask(task)

    parentElement.classList.toggle('list-group-item-done')
}

function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function renderTask(task) {
    const taskHTML =  `
    <li id="${task.id}" class="list-group-item ${task.done ? "list-group-item-done" : ""}">
              <span class="task-title">${task.text}</span>
              <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                  <img src="public/favicon/Check.svg" alt="Done" width="22" height="22">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                  <img src="public/favicon/Trash.svg" alt="Done" width="22" height="22">
                </button>
              </div>
            </li>`
    const targetList = task.done ? tasksDoneListElement : tasksToDoListElement
    targetList.insertAdjacentHTML("afterbegin", taskHTML)
}

