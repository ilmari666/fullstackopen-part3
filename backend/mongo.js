require('dotenv').config();
const mongoose = require('mongoose');

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  created: Date
});

mongoose.connect(process.env.DB_URI);

if (process.argv.length === 4) {
  const [name, number] = process.argv.slice(2);
  console.log(`lisätään henkilö ${name} numero ${number} luetteloon`);
  const p = new Person({
    name,
    number,
    created: new Date()
  });
  p.save().then(response => mongoose.connection.close());
} else {
  console.log('puhelinluettelo:');
  Person.find({}).then(result => {
    result.forEach(({ name, number }) => {
      console.log(`${name} ${number}`);
    });
    mongoose.connection.close();
  });
}
