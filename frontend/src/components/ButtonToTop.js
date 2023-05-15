import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const ButtonToTop = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <>
    <Button
      variant="dark"
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: '#418134',
        border: 'none',
        borderRadius: '3rem',
        outline: 'none',
        cursor: 'pointer',
      }}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </Button>
    </>
  );
};

export default ButtonToTop;
