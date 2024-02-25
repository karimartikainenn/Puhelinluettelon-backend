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

app.use(express.json())

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

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = numbers.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        console.log(`No user found with the provided ID: ${id}`)
        response.status(404).end()
    }
})

const generateId = () => {
    const maxId = numbers.length > 0
      ? Math.max(...numbers.map(n => n.id))
      : 0
    return maxId + 1
  }

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    numbers = numbers.concat(person)

    response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    numbers = numbers.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)