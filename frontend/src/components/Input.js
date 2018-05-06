import React from 'react';

const Input = props => (<div>
  {props.label} <input {...props} />
</div>);

export default Input;
