const express = require('express')
const app = express()

let numbers = [
    {
        id: 1,
        name: "Kari Martikainen",
        number: "0452350455",
    },
    {
        id: 2,
        name: "Made Im-ari",
        number: "0491294900",
    },
    {
        id: 3,
        name: "Juha Martikainen",
        number: "0491281199",
    },
    {
        id: 4,
        name: "Jaakko Jokinen",
        number: "0419249277",
    }
]

app.get("/", (request, response) => {
    response.send("<h1>Puhelinluettelo</h1>")
})

app.get("/info", (request, response) => {
    const summa = numbers.length > 0
    ? Math.max(...numbers.map(n => n.id))
    : 0
    const requestDateTime = new Date().toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' });
    response.send(`Phonebook has info for ${summa} people\n Request made at: ${requestDateTime}`)
})

app.get("/api/persons", (request, response) => {
    response.json(numbers)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)