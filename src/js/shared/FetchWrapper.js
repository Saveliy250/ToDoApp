export class FetchWrapper {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async get(url) {
        const response = await fetch(`${this.baseUrl}${url}`)
        return response.json()
    }

    async post(url, body) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.json()
    }

    async delete(url) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'DELETE',
        })
        return response.json()
    }
    async patch(url, body) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.json()
    }
}