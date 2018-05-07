const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3001;
let persons = [{ name: 'nimi', number: '123', id: 1, created: 12345678 }]; //@todo copy from tehtävänanto
const app = express();
app.use(bodyParser.json());

const getId = function() {
  return Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
};

const addNewPerson = function(name, number) {
  const person = {
    name,
    number,
    created: new Date().getTime(),
    id: getId()
  };
  persons.push(person);
  return person;
};

const getWithName = personName =>
  persons.find(({ name }) => name === personName);

const getWithId = personID => persons.find(({ id }) => id === personID);

const removeId = personId => persons.filter(({ id }) => id != personID);

const respondWithError = (response, statusCode, message) => {
  response.status(statusCode);
  response.json({ error: message });
};

app.get('/info', (request, response) => {
  const message = `<html>puhelinluettelossa on ${
    persons.length
  }henkilön tiedot<br/>${new Date().toString()}</html>`;
  response.send(message);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = getWithId(id);
  if (person) {
    response.json(person);
  }
  respondWithError(response, 404, `No user exists with id ${id}`);
  response.status(404).end();
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  if (!name) {
    respondWithError(response, 400, `Name must be defined.`);
  }
  if (!number) {
    respondWithError(response, 400, `Number must be defined.`);
  }
  if (name && number) {
    const existingPerson = getWithName(name);
    if (existingPerson) {
      respondWithError(response, 409, 'Name must be unique');
    }
    const newPerson = addNewPerson(name, number);
    response.status(201);
    response.json(newPerson);
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const updatedPersons = removeId(id);
  if (updatedPersons.length !== persons.length) {
    persons = updatedPersons;
    response.status(204).end();
  }
  respondWithError(response, 404, `No user exists with id ${id}`);
});

app.put('/api/persons/:id', (request, response) => {
  const { name, number } = request.body;
  if (!name) {
    respondWithError(response, 400, `Name must be defined.`);
  }
  if (!number) {
    respondWithError(response, 400, `Number must be defined.`);
  }
  let member = getById(id);
  if (member) {
    member.name = name;
    member.number = number;
    response.json(member);
  }
});

app.patch('/api/persons/:id', (request, response) => {
  const { patch } = request.body;
  let member = getById(id);
  if (member) {
    Object.entries(patch).forEach(([key, value]) => (member[key] = value));
    response.json(member);
  }
  respondWithError(response, 404, `No user exists with id ${id}`);
});

app.listen(PORT);
