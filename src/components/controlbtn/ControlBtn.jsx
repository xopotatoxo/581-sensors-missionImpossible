import React from 'react';
import './Controlbtn.scss';
const ControlBtn = ({ text, color = 0, handleClick, disable }) => {
  return (
    <div className="control_btn_container" style={{ '--hue': color }}>
      <div className="control_btn__outline">
        <button
          className={`control_btn ${disable ? 'control_btn--disable' : ''}`}
          onClick={handleClick}
        >
          <span
            className={`control_btn__front ? ${disable ? 'control_btn__front--disable' : ''}`}
          >
            {text}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ControlBtn;
