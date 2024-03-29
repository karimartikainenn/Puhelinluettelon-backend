require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Person = require('./models/number');

// Middleware
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

morgan.token('postData', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
  return '';
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Puhelinluettelo</h1>');
});

app.get('/info', async (req, res) => {
  try {
    const count = await Person.countDocuments({});
    const requestDateTime = new Date().toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' });
    res.send(`Phonebook has info for ${count} people\n Request made at: ${requestDateTime}`);
  } catch (error) {
    console.error('Error retrieving info:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/persons', async (request, response) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/persons/:id', async (request, response) => {
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    console.error('Error fetching person:', error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/persons', async (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number missing' });
  }

  try {
    const existingPerson = await Person.findOne({ name: body.name });
    if (existingPerson) {
      return response.status(400).json({ error: 'Name must be unique' });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id, 
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', async (request, response) => {
    try {
      const deletedPerson = await Person.findByIdAndDelete(request.params.id);
      if (!deletedPerson) {
        return response.status(404).json({ error: 'Person not found' });
      }
      response.status(204).end();
    } catch (error) {
      console.error('Error deleting person:', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// backend on kivaa!