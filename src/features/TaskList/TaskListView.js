
export class TaskListView {

    constructor(taskModel, taskRepository) {
        this.taskModel = taskModel
        this.taskRepository = taskRepository
        this.elements = {
            taskInputElement: document.querySelector("#taskInput"),
            formElement : document.querySelector("#form"),
            tasksToDoListElement: document.querySelector("#tasksToDoList"),
            tasksDoneListElement : document.querySelector("#tasksDoneList"),
            containerElement: document.querySelector("#mainContainer"),
            errorElement: document.querySelector(".error")
        }

        this.initView()
        this.bindHandlers()
    }

    initView = async () => {
        if (localStorage.getItem("tasks") && localStorage.getItem("tasks") !== "[]") {
            this.taskModel.setTask(JSON.parse(localStorage.getItem("tasks")))
        } else {
            try {
                this.taskModel.setTask(await this.taskRepository.getTasksFromServer())
            } catch (error) {
                this.elements.errorElement.innerHTML = "Не удалось получить данные о задачах"
            }
        }

        this.taskModel.getTasks().forEach(task => {
            this.renderTask(task);
        })

        this.taskModel.tasks.subscribe((value) => {
            this.saveToLocalStorage("tasks", value)
        })
    }

    bindHandlers = () => {
        const { formElement, containerElement } = this.elements
        formElement.addEventListener("submit", this.handleAddTask)
        containerElement.addEventListener('click', this.handleDeleteTask)
        containerElement.addEventListener('click', this.handleDoneTask)

    }

    handleAddTask = async (e) =>  {
        const { taskInputElement, errorElement } = this.elements
        e.preventDefault()
        const taskTextInput = taskInputElement.value

        const newTask = {
            text: taskTextInput,
            done: false
        }
        try {
            const task = await this.taskRepository.addTask(newTask)
            this.taskModel.addTask(task)
            this.renderTask(task)
            taskInputElement.value = ''
            taskInputElement.focus()
        } catch (error) {
            errorElement.innerHTML = "Не удалось добавить задачу"
        }
    }

    handleDeleteTask = async (e) =>  {
        if (e.target.dataset.action !== "delete") {
            return
        }

        const taskItem = e.target.closest(".list-group-item")
        const taskId = Number(taskItem.id)
        try {
            const response = await this.taskRepository.deleteTask(taskId)
            this.taskModel.deleteTask(taskId)
            taskItem.remove()
        } catch (error) {
            this.elements.errorElement.innerHTML = "Не удалось удалить задачу"
        }
    }

    handleDoneTask = async (e) => {
        if (e.target.dataset.action !== "done") {
            return
        }

        const taskItem = e.target.closest(".list-group-item")
        const taskId = Number(taskItem.id)
        const task = this.taskModel.getTaskById(taskId)
        try {
            const taskNew = await this.taskRepository.patchTask({
                "done": !task.done
            }, taskId)
            this.taskModel.doneTask(taskId)
            taskItem.remove()

            taskItem.classList.toggle('list-group-item-done')
            this.renderTask(taskNew)
        } catch (error) {
            this.elements.errorElement.innerHTML = "Не удалось изменить статус задачи"
        }
    }

    renderTask = (task) => {
        const {tasksDoneListElement, tasksToDoListElement} = this.elements
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

    saveToLocalStorage(key, value) {
        localStorage.setItem("tasks", JSON.stringify(value))
    }
}