import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getAll = () => axios.get(baseUrl).then(({ data }) => data);

const createPerson = person => axios.post(baseUrl, person).then(({ data }) => data);

const updatePerson = (person, id) => axios.put(`${baseUrl}/${id}`, person).then(({ data }) => data);

const removePerson = id => axios.delete(`${baseUrl}/${id}`).then(({ data }) => data);


export default { getAll, createPerson, updatePerson, removePerson };
