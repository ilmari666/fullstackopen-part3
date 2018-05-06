const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3001;
let persons = [{ name: 'nimi', number: '123', id: 1, created: 12345678 }]; //@todo copy from tehtävänanto
const app = express();
app.use(bodyParser.json());

const addNewPerson = function(name, number) {
  // copy from client
  return {
    name,
    number,
    created: new Date().now()
  };
};

app.post('/api/persons', (request, response) => {
  const person = request.body;
  try {
    // never throws need working validation
    const { name, number } = request.body;
    const newPerson = addNewPerson(name, number);
    response.json(newPerson);
  } catch (e) {
    response.status(204).end();
  }
});

app.listen(PORT);
