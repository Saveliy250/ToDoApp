export class Observable {
    subscribers = new Set()

    constructor(initialValue) {
        this.value = initialValue;
    }

    subscribe = (func) => {
        this.subscribers.add(func)
    }
    unsubscribe = (func) => {
        this.subscribers.delete(func)
    }

    notify = (data) => {
        this.subscribers.forEach(func => func(data))
    }
}