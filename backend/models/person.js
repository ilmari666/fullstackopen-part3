const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // eslint-disable-line
}
mongoose.connect(process.env.DB_URI);

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
  created: Date,
});

PersonSchema.statics.format = person => {
  const {
    name, number, created, _id: id,
  } = person;
  return {
    name, number, created, id,
  };
};

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
