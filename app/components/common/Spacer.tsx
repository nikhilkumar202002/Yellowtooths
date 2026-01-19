import React from 'react';

const Spacer = () => {
  // Ensure 'spacer-y-primary' is defined in globals.css 
  // or replace with 'h-24 md:h-32' if CSS class is missing.
  return <div className={'spacer-y-primary'} />;
};

export default Spacer;