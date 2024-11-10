import './Toggles.scss';
import { playAudio } from '../../utils/useAudio.jsx';
import whooshSFX from '../../assets/whoosh.mp3';

/**
 * This code is based on: https://3dtransforms.desandro.com/box
 * @param isDisabled
 * @param side the state used to hold which side to display
 * @param setSide the setter is set which side to display
 * @returns {JSX.Element} The radio buttons
 */
const Toggles = ({ isDisabled, side, setSide }) => {
  /**
   * Get the side selected from the radio button
   * @param event the radio button click
   */
  const selectSide = (event) => {
    const selectedSide = event.target.value;
    setSide(selectedSide);
    playAudio(new Audio(whooshSFX), 1, 0);
  };

  return (
    <div className="toggle">
      <label className="toggle__label">
        <input
          type="radio"
          name="rotate-cube-side"
          value="front"
          checked={side === 'front'}
          disabled={isDisabled}
          onChange={selectSide}
        />
        Front
      </label>
      <label className="toggle__label">
        <input
          type="radio"
          name="rotate-cube-side"
          value="right"
          checked={side === 'right'}
          disabled={isDisabled}
          onChange={selectSide}
        />
        Right
      </label>
      <label className="toggle__label">
        <input
          type="radio"
          name="rotate-cube-side"
          value="back"
          checked={side === 'back'}
          disabled={isDisabled}
          onChange={selectSide}
        />
        Back
      </label>
      <label className="toggle__label">
        <input
          type="radio"
          name="rotate-cube-side"
          value="left"
          checked={side === 'left'}
          disabled={isDisabled}
          onChange={selectSide}
        />
        Left
      </label>
      <label className="toggle__label">
        <input
          type="radio"
          name="rotate-cube-side"
          value="top"
          checked={side === 'top'}
          disabled={isDisabled}
          onChange={selectSide}
        />
        Top
      </label>
      <label className="toggle__label">
        <input
          type="radio"
          name="rotate-cube-side"
          value="bottom"
          checked={side === 'bottom'}
          disabled={isDisabled}
          onChange={selectSide}
        />
        Bottom
      </label>
    </div>
  );
};

export default Toggles;
