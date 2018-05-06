import React from 'react';
import Button from './Button';

const Contact = ({ name, number, remove, id }) => (
  <p>
    {name} {number}
    <Button onClick={remove(id, name)}>delete</Button>
  </p>);

export default Contact;
