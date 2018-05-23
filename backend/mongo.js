const Person = require('./models/person');
const mongoose = require('mongoose');

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
