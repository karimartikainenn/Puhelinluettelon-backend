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
    }
]

app.get("/", (request, response) => {
    response.send("<h1>Puhelinluettelo</h1>")
})

app.get("/api/persons", (request, response) => {
    response.json(numbers)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)