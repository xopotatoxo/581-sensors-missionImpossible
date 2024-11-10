import './Bomb.scss';
import { useDeviceOrientation } from './useDeviceOrientation';
import OrientationSwitcher from './OrientationSwitcher';
import bombFront from '../../assets/bomb_front.png';
import bombBack from '../../assets/bomb_back.png';
import bombTop from '../../assets/bomb_top.png';
import bombBottom from '../../assets/bomb_bottom.png';
import bombSide from '../../assets/bomb_side.png';
import Light from '../light/Light.jsx';
import key1 from '../../assets/key_1.png';
import key2 from '../../assets/key_2.png';
import key3 from '../../assets/key_3.png';
import key4 from '../../assets/key_4.png';
import key5 from '../../assets/key_5.png';
import key6 from '../../assets/key_6.png';
import { playAudio } from '../../utils/useAudio.jsx';
import clickSFX from '../../assets/click.mp3';
import ControlBtn from '../controlbtn/ControlBtn.jsx';

/**
 * This code is based on: https://3dtransforms.desandro.com/box
 * @returns Bomb element
 */
const Bomb = ({
  side,
  setPuzzleNum,
  setDontHoldBomb,
  dontHoldBomb,
  setShowToggles,
  puzzlesDone,
}) => {
  const handleClick = (puzzleNum) => {
    setPuzzleNum(puzzleNum);
    playAudio(new Audio(clickSFX), 1, 0);
  };

  const { requestAccess, revokeAccess, cssTransformInverse } =
    useDeviceOrientation();

  const onToggle = (toggleState) => {
    toggleState ? requestAccess() : revokeAccess();
    setDontHoldBomb(toggleState);
    playAudio(new Audio(clickSFX), 1, 0);
  };

  const handleToggles = () => {
    setShowToggles((prev) => !prev);
    playAudio(new Audio(clickSFX), 1, 0);
  };

  return (
    <>
      <div className="bomb-scene">
        <div className="bomb__controls">
          <OrientationSwitcher
            onToggle={onToggle}
            labelOff="Hold"
            labelOn="Hold"
          />
          <ControlBtn
            text={'Manual'}
            color={255}
            handleClick={handleToggles}
            disable={dontHoldBomb}
          />
        </div>
        <div className={`bomb show-${side}`} style={cssTransformInverse}>
          <div className="bomb__face bomb__face--front">
            <img
              src={bombFront}
              alt=""
              className="bomb__img"
              draggable={false}
            />
            <button className="bomb__modal-btn" onClick={() => handleClick(1)}>
              <img
                className="modal-btn__img"
                src={key1}
                alt=""
                draggable={false}
              />
            </button>
            <Light done={puzzlesDone.timer} />
          </div>
          <div className="bomb__face bomb__face--back">
            <img
              src={bombBack}
              alt=""
              className="bomb__img"
              draggable={false}
            />
            <button className="bomb__modal-btn" onClick={() => handleClick(2)}>
              <img
                className="modal-btn__img"
                src={key2}
                alt=""
                draggable={false}
              />
            </button>
            <Light done={puzzlesDone.compassWires} />
          </div>
          <div className="bomb__face bomb__face--right">
            <img
              src={bombSide}
              alt=""
              className="bomb__img"
              draggable={false}
            />
            <button className="bomb__modal-btn" onClick={() => handleClick(3)}>
              <img
                className="modal-btn__img"
                src={key3}
                alt=""
                draggable={false}
              />
            </button>
            <Light done={puzzlesDone.cutWire} />
          </div>
          <div className="bomb__face bomb__face--left">
            <img
              src={bombSide}
              alt=""
              className="bomb__img"
              draggable={false}
            />
            <button className="bomb__modal-btn" onClick={() => handleClick(4)}>
              <img
                className="modal-btn__img"
                src={key4}
                alt=""
                draggable={false}
              />
            </button>
            <Light done={puzzlesDone.mazeGame} />
          </div>
          <div className="bomb__face bomb__face--top">
            <img src={bombTop} alt="" className="bomb__img" draggable={false} />
            <button className="bomb__modal-btn" onClick={() => handleClick(5)}>
              <img
                className="modal-btn__img"
                src={key5}
                alt=""
                draggable={false}
              />
            </button>
            <Light done={puzzlesDone.number} />
          </div>
          <div className="bomb__face bomb__face--bottom">
            <img
              src={bombBottom}
              alt=""
              className="bomb__img"
              draggable={false}
            />
            <button className="bomb__modal-btn" onClick={() => handleClick(6)}>
              <img
                className="modal-btn__img"
                src={key6}
                alt=""
                draggable={false}
              />
            </button>
            <Light done={puzzlesDone.lightSensor} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Bomb;
