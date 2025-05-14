import {TaskModel} from "./TaskModel.js";
import {TaskRepository} from "./TaskRepository.js";
import {TaskListView} from "./TaskListView.js";

export const setupTaskList = () => {
    const taskModel = new TaskModel()
    const taskRepository = new TaskRepository()

    new TaskListView(taskModel, taskRepository)
}