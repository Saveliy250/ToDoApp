import {FetchWrapper} from "../../js/shared/FetchWrapper.js";

export class TaskRepository {
    endPoint = 'tasks'
    fetchWrapper = new FetchWrapper('https://73a95a8fb71c882b.mokky.dev')

    getTasksFromServer = () => {
        return this.fetchWrapper.get(this.endPoint)
    }

    addTask = (data) => {
        return this.fetchWrapper.post(this.endPoint, data)
    }
    deleteTask = (id) => {
        return this.fetchWrapper.delete(this.endPoint, id)
    }
    patchTask = (data, id) => {
        return this.fetchWrapper.patch(this.endPoint, data, id)
    }
}