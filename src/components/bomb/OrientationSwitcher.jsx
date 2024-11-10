// credits: https://github.com/trekhleb/trekhleb.github.io/blob/master/src/posts/2021/gyro-web/components/OrientationSwitcher.tsx
import React, { useState } from 'react';

import { useDeviceOrientation } from './useDeviceOrientation';
import './OrientationSwitcher.scss';

const OrientationSwitcher = (props) => {
  const {
    onToggle: onSwitchToggle,
    labelOn = 'Using orientation',
    labelOff = 'Use orientation',
  } = props;

  const { error, requestAccess, revokeAccess } = useDeviceOrientation();

  const [orientationAvailable, setOrientationAvailable] = useState(false);

  const onToggle = (checkboxEvent) => {
    const toggleState = checkboxEvent.target.checked;

    if (toggleState) {
      requestAccess().then((granted) => {
        if (granted) {
          setOrientationAvailable(true);
        } else {
          setOrientationAvailable(false);
        }
      });
    } else {
      revokeAccess().then(() => {
        setOrientationAvailable(false);
      });
    }
    onSwitchToggle(toggleState);
  };

  const errorElement = error ? (
    <div>
      <span>{error.message}</span>
    </div>
  ) : null;

  return (
    <div className="gyro_switch__container">
      <label className="gyro_switch__label">
        <input
          type="checkbox"
          className="gyro_switch__checkbox"
          onChange={onToggle}
          checked={orientationAvailable}
        />
        <div className="gyro_switch__outline">
          <div className="gyro_switch__pushable">
            <span className="gyro_switch__front">
              {orientationAvailable ? labelOn : labelOff}
            </span>
          </div>
        </div>
      </label>

      {errorElement}
    </div>
  );
};

export default OrientationSwitcher;
