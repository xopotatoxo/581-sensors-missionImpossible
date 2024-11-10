import './CompassWires.scss';
import Compass from './Compass.jsx';
import resistorIMG from '../../assets/resistor2.png';
import { useState } from 'react';
import { playAudio } from '../../utils/useAudio.jsx';
import overheatSFX from '../../assets/overheat.mp3';

const CompassWires = ({ setPuzzleValue }) => {
  const [heading, setHeading] = useState(0);
  const [resistorsSelected, setResistorsSelected] = useState([]);
  const [pendingResistor, setPendingResistor] = useState(null);

  /**
   * Handles when a resistor is clicked. If it is the first time the resistor
   * is clicked then we will set it as the resistor the user wants to set.
   * If they click the same resistor again, if there is a heading
   * we will set it as a resistor value.
   * ONLY SET 3 resistors.
   * @param resistorId the resistor the user is setting
   */
  const handleResistorClick = (resistorId) => {
    if (pendingResistor === resistorId) {
      // Finalize the resistor (store its value)
      if (heading !== null) {
        // Update the resistors, keep only the last 3
        setResistorsSelected((prev) => {
          const newResistors = [...prev, { resistorId, heading }];
          if (newResistors.length > 3) {
            newResistors.shift(); // remove the oldest entry (it's a queue!!!!!)
          }

          setPuzzleValue(newResistors);

          return newResistors;
        });
      }
      setPendingResistor(null); // Clear pending state
    } else {
      // If a different resistor was previously pending, clear it
      setPendingResistor(resistorId);
    }
    playAudio(new Audio(overheatSFX), 0.8, 1);
  };

  return (
    <div className="compass-wires-container">
      <div className="compass-wires">
        {[1, 2, 3, 4, 5, 6].map((wireNum) => (
          <div className={`wire wire${wireNum}`} key={`WIRE-UNIQUE-${wireNum}`}>
            <div className="light-drop-container">
              <div className={`light-drop light-drop-${wireNum}`}></div>
            </div>
            <img
              className={`resistor resistor-${wireNum} ${pendingResistor === `res-${wireNum}` ? 'resistor-overheat' : ''}`}
              src={resistorIMG}
              alt=""
              onClick={() => handleResistorClick(`res-${wireNum}`)}
              draggable={false}
            />
          </div>
        ))}
      </div>
      <div className="compass-wires-compass">
        <Compass
          heading={heading}
          setHeading={setHeading}
          pendingResistor={pendingResistor}
        />

        {/* Used to test the heading values remove later */}
        {/*<ul className="resistor-setting-test">*/}
        {/*  <li>Test</li>*/}
        {/*  {resistorsSelected.map((resistor, index) => (*/}
        {/*    <li key={index}>*/}
        {/*      {resistor.resistorId}: {resistor.heading}*/}
        {/*    </li>*/}
        {/*  ))}*/}
        {/*</ul>*/}
        {resistorsSelected.map((resistor, index) => (
          <div className="compass__marker" key={`marker-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default CompassWires;
