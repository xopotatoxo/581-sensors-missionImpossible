import { useEffect, useState } from 'react';
import Battery from './Battery.jsx';
import './LightSensor.scss';
import batteryStartSFX from '../../assets/battery-start.mp3';
import batteryDoneSFX from '../../assets/battery-done.mp3';
import { playAudio } from '../../utils/useAudio.jsx';

/**
 * https://deanhume.com/ambient-light-sensor/
 * https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor
 * @returns {JSX.Element}
 * @constructor
 */
const LightSensor = ({ setPuzzleValue }) => {
  // Stores the lux values for each battery
  const [lux1, setLux1] = useState(-1);
  const [lux2, setLux2] = useState(-1);
  const [lux3, setLux3] = useState(-1);

  useEffect(() => {
    setPuzzleValue({ lux1, lux2, lux3 });
  }, [lux1, lux2, lux3]);

  // tracks the battery the user is interacting with
  const [batteryNum, setBatteryNum] = useState(-1);

  useEffect(() => {
    let sensor;

    /**
     * Determines which battery to show luminance change for
     */
    const handleLuminance = () => {
      switch (batteryNum) {
        case 1:
          setLux1(sensor.illuminance);
          break;
        case 2:
          setLux2(sensor.illuminance);
          break;
        case 3:
          setLux3(sensor.illuminance);
          break;
        default:
          break;
      }
    };

    const handleError = (event) => {
      alert(
        'An error occurred with the light sensor. Refresh page and try again.'
      );
    };

    if ('AmbientLightSensor' in window) {
      try {
        sensor = new AmbientLightSensor();
        sensor.addEventListener('reading', handleLuminance);
        sensor.addEventListener('error', handleError);
        sensor.start();
      } catch (e) {
        handleError();
      }
    }

    return () => {
      if (sensor) {
        sensor.removeEventListener('reading', handleLuminance);
        sensor.removeEventListener('error', handleError);
        sensor.stop();
      }
    };
  }, [batteryNum]);

  const clickHandler = (battery) => {
    // If the battery is clicked on again we can play the done sound
    // This lets the user know they are done
    if (battery === batteryNum) {
      setBatteryNum(-1);
      playAudio(new Audio(batteryDoneSFX), 0.8, 0.02);

      // When the battery is clicked for charging
    } else {
      playAudio(new Audio(batteryStartSFX), 0.8, 0.006);

      // When the user clicks on a battery reset its lux value and then
      // allow them to set it
      switch (battery) {
        case 1:
          setLux1(-1);
          break;
        case 2:
          setLux2(-1);
          break;
        case 3:
          setLux3(-1);
          break;
        default:
          break;
      }
      setBatteryNum(battery);
    }
  };

  return (
    <div className="light-sensor-container">
      <div className="light-sensor">
        <div className="battery-container">
          <div className="battery-cell" onClick={() => clickHandler(1)}>
            <Battery lux={lux1} animate={batteryNum === 1} />
            <div
              className={`battery-indicator battery-indicator-1 ${lux1 >= 1000 ? 'battery-indicator-charged' : ''}`}
            ></div>
          </div>
          <div className="battery-cell" onClick={() => clickHandler(2)}>
            <Battery lux={lux2} animate={batteryNum === 2} />
            <div
              className={`battery-indicator battery-indicator-2 ${lux2 >= 1000 ? 'battery-indicator-charged' : ''}`}
            ></div>
          </div>
          <div className="battery-cell" onClick={() => clickHandler(3)}>
            <Battery lux={lux3} animate={batteryNum === 3} />
            <div
              className={`battery-indicator battery-indicator-3 ${lux3 >= 1000 ? 'battery-indicator-charged' : ''}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightSensor;
