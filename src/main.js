import {setupTaskList} from "./features/TaskList/setupTaskList.js";
import "./scss/style.scss"
function main() {
    setupTaskList()
}
window.addEventListener('DOMContentLoaded', () => {
    main()
})