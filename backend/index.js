const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = 3001;
let persons = [
  { name: 'nimi ykkönen', number: '123', id: 1, created: 12345678 },
  { name: 'nimi kakkonen', number: '1234', id: 2, created: 12345679 }
]; //@todo copy from tehtävänanto

const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny'));

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

const getWithId = personId => persons.find(({ id }) => id === personId);

const removeId = personId => persons.filter(({ id }) => id != personId);

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
    return response.json(person);
  }
  respondWithError(response, 404, `No user exists with id ${id}`);
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  if (!name) {
    return respondWithError(response, 400, `Name must be defined.`);
  }
  if (!number) {
    return respondWithError(response, 400, `Number must be defined.`);
  }
  if (name && number) {
    const existingPerson = getWithName(name);
    if (existingPerson) {
      return respondWithError(response, 409, 'Name must be unique');
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
    return response.status(204).end();
  }
  respondWithError(response, 404, `No user exists with id ${id}`);
});

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const { name, number } = request.body;
  //doesnt check for duplicate existing name
  if (!name) {
    return respondWithError(response, 400, `Name must be defined.`);
  }
  if (!number) {
    return respondWithError(response, 400, `Number must be defined.`);
  }
  let member = getWithId(id);
  if (member) {
    member.name = name;
    member.number = number;
    response.json(member);
  }
});

app.patch('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const patch = request.body;
  let member = getWithId(id);
  if (member) {
    //doesnt validate keys
    //doesnt validate entries for duplicate content (ie names)
    Object.entries(patch).forEach(([key, value]) => (member[key] = value));
    return response.json(member);
  }
  respondWithError(response, 404, `No user exists with id ${id}`);
});

// catch unhandled requests
const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(error);

app.listen(PORT);
