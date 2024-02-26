require('dotenv').config()
const express = require('express')
const app = express()
const cors = require("cors")
const morgan = require('morgan')
const mongoose = require("mongoose");
const Person = require('./models/number');

morgan.token("postData", (request) => {
    if (request.method === "POST") {
        return JSON.stringify(request.body)
    } else {
        return ""; 
    }
})


let persons = []

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

app.get("/", (request, response) => {
    response.send("<h1>Puhelinluettelo</h1>")
})

app.get("/info", async (req, res) => {
    try {
        const count = await Person.countDocuments({});
        const requestDateTime = new Date().toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' });
        res.send(`Phonebook has info for ${count} people\n Request made at: ${requestDateTime}`);
    } catch (error) {
        console.error("Error retrieving info:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const person = new Note({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

    const existingPerson = persons.find(person => person.name === body.name);
    if (existingPerson) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

app.delete("/api/persons/:id", (request, response) => {
    const id = Person(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)