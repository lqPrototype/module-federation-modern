import React from 'react';
import Button from 'antd/lib/button';
import stuff from './stuff.module.css';

const Image =  () => {
  return (
    <div
      id="remote-components"
      style={{
        backgroundColor: '#1ee9c1',
        color: 'lightgrey',
        padding: '1rem',
      }}
    >
      <h2>
        <strong>remote</strong>&nbsp;image
      </h2>
      <button
        id="remote-components-button"
        style={{ marginBottom: '1rem' }}
        onClick={() =>
          alert('[remote-components] Client side Javascript works!')
        }
      >
        Click me to test i'm interactive!
      </button>
      <img
        id="remote-components-image"
        src="https://module-federation.io/module-federation-logo.svg"
        style={{ width: '100px' }}
        alt="serge"
      />
      <Button type="primary">Button from remote</Button>
    </div>
  );
};

export default Image;
