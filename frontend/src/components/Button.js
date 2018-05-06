import React from 'react';

const Button = (props) => {
  const style = {
    margin: '10px',
  };
  return <button {...props} style={style} />;
};

export default Button;
