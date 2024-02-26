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

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

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

app.post('/api/persons', async (request, response) => {
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
    console.error('Error saving person:', error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  try {
    const id = Person(request.params.id);
    persons = persons.filter(person => person.id !== id)
    response.status(204).end();
  } catch (error) {
    console.error('Error deleting person:', error.message);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
