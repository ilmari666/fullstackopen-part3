const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const Person = require('./models/person');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));

morgan.token('body', req => JSON.stringify(req.body));

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'));

const respondWithError = (response, statusCode, message) => {
  response.status(statusCode);
  response.json({ error: message });
};

app.get('/info', (request, response) => {
  Person.find({}).then((result) => {
    const message = `<html>puhelinluettelossa on ${result.length} henkilön tiedot<br/>${new Date().toString()}</html>`;
    response.send(message);
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => response.json(result.map(Person.format)));
});

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  Person.findById(id)
    .then(Person.format)
    .then(formattedPerson => response.json(formattedPerson))
    .catch(() =>
      respondWithError(response, 404, `No user exists with id ${id}`));
});

app.post('/api/persons', (request, response) => { // eslint-disable-line
  const { name, number } = request.body;
  if (!name) {
    return respondWithError(response, 400, 'Name must be defined.');
  }
  if (!number) {
    return respondWithError(response, 400, 'Number must be defined.');
  }
  if (name && number) {
    Person.findOne({ name })
      .then((result) => {
        if (result !== null) {
          throw new Error('Name must be unique');
        }
        const person = new Person({
          name,
          number,
          created: new Date(),
        });
        person
          .save()
          .then(Person.format)
          .then((formattedPerson) => {
            response.status(201);
            response.json(formattedPerson);
          });
      })
      .catch(() => respondWithError(response, 409, 'Name must be unique'));
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  Person.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch(() => respondWithError(response, 400, 'Bad request'));
});

app.put('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  const { name, number } = request.body;
  if (name && number) {
    Person.findOneAndUpdate(id, { name, number })
      .then((data) => data)
      .then(Person.format)
      .then(formattedPerson => response.json(formattedPerson))
      .catch(() => respondWithError(response, 400, 'Bad request'));
  } else {
    respondWithError(response, 400, 'Bad request');
  }
});

app.patch('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  // no validation of patch data can overwrite anything
  const patch = request.body;
  Person.findOneAndUpdate(id, patch)
    .then(Person.format)
    .then(formattedPerson => response.json(formattedPerson))
    .catch(() =>
      respondWithError(response, 404, `No user exists with id ${id}`));
});

// catch unhandled requests
const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(error);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); //eslint-disable-line
});
