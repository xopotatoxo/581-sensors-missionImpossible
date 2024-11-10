import React, { useState, useEffect } from 'react';
import './Compass.scss';
import compassImg from '../../assets/compass2.png';

/**
 * Compass tutorial:
 * https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientationabsolute_event
 */

/**
 * Compass component that determines the heading the users is at.
 * Can be deviated by passing in a resistor value
 * @param heading the heading value
 * @param setHeading the setter to set the heading
 * @param pendingResistor the resistor the user has clicked (used to deviate the compass)
 * @returns {Element} the compass component
 */
const Compass = ({ heading = 0, setHeading, pendingResistor }) => {
  // const [heading, setHeading] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Checks for iOS devices
  const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

  // Checks if permission is requested
  const requiresPermission =
    typeof DeviceOrientationEvent.requestPermission === 'function';

  const resistorDeviations = {
    'res-1': 0,
    'res-2': 156,
    'res-3': 87,
    'res-4': 45,
    'res-5': 30,
    'res-6': 210,
  };

  const [deviation, setDeviation] = useState(0);

  useEffect(() => {
    /**
     * Sets the heading value in the compass
     * @param event the device movement event
     */
    const handleCompass = (event) => {
      // absolute indicates if the heading value is accurate
      if ((isIOS && event.webkitCompassHeading) || event.absolute) {
        // webkit for iOS devices, alpha for android
        let compassValue = event.webkitCompassHeading || event.alpha;

        // if there is a value set it.
        if (compassValue !== null) {
          // Modulo keeps the value between 0 and 360 inclusive
          setHeading((Math.floor(compassValue) + deviation) % 360);

          // alert to error
        } else {
          alert(
            'Compass heading could not be found. Reset page and try again.'
          );
        }
      } else {
        alert('Compass heading may not be precise');
      }
    };

    // If it is iOS or requires permission ask for it
    if (isIOS || requiresPermission) {
      document.body.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === 'granted') {
              setPermissionGranted(true);
              window.addEventListener('deviceorientation', handleCompass);
            } else {
              setPermissionGranted(false);
              alert('Permission not granted. You cannot use the application.');
            }
          })
          .catch(() => {
            alert('Compass functionality not supported');
          });
      });
    } else {
      // Non iOS platform (e.g., Android)
      setPermissionGranted(true);
      window.addEventListener('deviceorientationabsolute', handleCompass);
    }

    // cleanup on component unmount
    return () => {
      if (isIOS) {
        window.removeEventListener('deviceorientation', handleCompass);
      } else {
        window.removeEventListener('deviceorientationabsolute', handleCompass);
      }
    };
  }, [deviation]);

  useEffect(() => {
    // if a resistor is selected set a deviation
    if (pendingResistor !== null) {
      const currentDeviation = resistorDeviations[pendingResistor];
      setDeviation(currentDeviation);
      // alert(`setting deviation ${currentDeviation}`);

      // no resistor = no deviation
    } else {
      setDeviation(0);
    }
  }, [pendingResistor]);

  return (
    <div className="compass">
      {permissionGranted ? (
        <div className="compass--show">
          <img
            className={`compass__img ${pendingResistor ? `glitch-${pendingResistor}` : ''}`}
            src={compassImg}
            alt=""
            style={{ transform: `rotate(${-heading}deg)` }}
            draggable={false}
          />

          <div className="compass__heading">{`${heading}°`}</div>
        </div>
      ) : (
        <div className="compass--hide">
          <p className="hide__text">
            Click on the screen to grant permission for orientation
          </p>
        </div>
      )}
    </div>
  );
};
export default Compass;
