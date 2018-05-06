const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3001;
let persons = [{ name: "nimi", number: "123" }];
const app = express();
app.use(bodyParser.json());

app.post("/api/persons", (request, response) => {
  response.status(200).end();
});

app.listen(PORT);
