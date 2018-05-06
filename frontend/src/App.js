import React from 'react';

import personsService from './services/persons'
import Button from './components/Button';
import Contacts from './components/Contacts';
import Input from './components/Input';
import Notification from './components/Notification';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      filter: '',
    };
  }

  onInputUpdate = (e) => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
   personsService.getAll()
    .then(persons=>this.setState({persons}));
  }

  submitForm = (e) => {
    e.preventDefault();
    const { newName : name, newNumber : number, persons } = this.state;
    const contact = { name, number };
    const existingContact = persons.find((contact)=>contact.name === name);

    if (existingContact){
      // CONFIRM then  update exiting contact
      const id = existingContact.id;
      if (window.confirm(`${name} on jo luettelossa. Korvataanko vanha numero uudella?`)){
        personsService.updatePerson(contact, id)
          .then(updatedContact =>{
            this.setState( {
              newName: '',
              newNumber: '',
              persons: persons.map(person=>person.id === id ? updatedContact : person),

            });
            this.notify(`${contact.name} numero on päivitetty.`);
          }).catch((e)=> {
            this.notify(`Kontaktia ${contact.name} ei löydetty, päivittäminen epäonnistui. Voit lisätä käyttäjän uudelleen.`, true);
            this.setState({persons: persons.filter(person=>person.id !== id)});
          });
      }
    } else {
      // create new contact
      personsService.createPerson(contact)
        .then(person => {
          this.setState( {
            newName: '',
            newNumber: '',
            persons: persons.concat(person),
          })
          this.notify(`${person.name} on lisätty luetteloon.`);
        })
      }
  };
  confirmRemoval = (id, name) => () => {
    if (window.confirm(`poistetaanko ${name}?`)){
      this.deletePerson(id);
      this.notify(`${name} on poistettu luettelosta.`);
    }
  }

  deletePerson = (id)=>{
    personsService.removePerson(id).then(()=>{
      const persons = this.state.persons.filter(person=>person.id !== id);
      this.setState({ persons });
    })
  };

  notify(note, error){
    clearTimeout(this.noteTimeout);
    this.setState({notification: note, error});
    this.noteTimeout = setTimeout(()=>this.setState({notification: ''}), 3000);
  }

  render() {
    const { persons, newName, newNumber, filter, notification, error } = this.state;

    return (
      <div>
        <Notification note={notification} error={error}/>
        <h2>Puhelinluettelo</h2>
        <form onSubmit={this.submitForm}>
          <Input label="hae:" name="filter" onChange={this.onInputUpdate} value={filter} />
          <h2>Lisää uusi</h2>
          <Input label="nimi:" name="newName" onChange={this.onInputUpdate} value={newName} />
          <Input label="numero:" name="newNumber" onChange={this.onInputUpdate} value={newNumber} />
          <Button type="submit">lisää</Button>
        </form>
        <Contacts heading="Numerot" contacts={persons} filter={filter} remove={this.confirmRemoval}/>
      </div>
    );
  }
}


export default App;
