import Bomb from '../../components/bomb/Bomb.jsx';
import Toggles from '../../components/toggles/Toggles.jsx';
import Modal from '../../components/modal/Modal.jsx';
import LightSensor from '../../components/battery/LightSensor.jsx';
import CompassWires from '../../components/compass/CompassWires.jsx';
import Timer from '../../components/timer/Timer.jsx';
import CutWire from '../../components/cutwire/CutWire.jsx';
import { useEffect, useState } from 'react';
import './Passcode.scss';
import { useNavigate } from 'react-router-dom';
import ControlBtn from '../../components/controlbtn/ControlBtn.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { playAudio } from '../../utils/useAudio.jsx';
import clickSFX from '../../assets/click.mp3';
import explosionSFX from '../../assets/explosion.mp3';
import MazeGame from '../../components/maze/MazeSimple.jsx';
import Number from '../../components/number/Number.jsx';

const Passcode = () => {
  const [side, setSide] = useState('front');
  const [puzzleNum, setPuzzleNum] = useState(null);
  const [dontHoldBomb, setDontHoldBomb] = useState(false);
  const defaultPuzzlesState = {
    compassWires: false,
    lightSensor: false,
    mazeGame: false,
    cutWire: false,
    number: false,
    timer: false,
  };
  const [puzzlesDone, setPuzzlesDone] = useState({ ...defaultPuzzlesState });
  const [correctPuzzleValues, setCorrectPuzzleValues] = useState({
    ...defaultPuzzlesState,
  });
  const [showToggles, setShowToggles] = useState(false);

  const clearPuzzle = () => {
    setPuzzleNum(null);
  };

  const navigate = useNavigate();

  // https://stackoverflow.com/questions/70612769/how-do-i-recognize-swipe-events-in-react
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 100;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientY);

  const onTouchEnd = () => {
    // if a modal is open prevent the user from going back to the lockscreen
    if (!touchStart || !touchEnd || puzzleNum) return;
    const distance = touchStart - touchEnd;
    const isSwipeDown = distance < -minSwipeDistance;
    if (isSwipeDown) {
      // console.log('swiping');
      navigate('/');
    }
  };

  // If the toggles were shown and the user holds the bomb, when they
  // release the bomb make sure the toggles are hidden as well
  useEffect(() => {
    if (dontHoldBomb || !puzzleNum) {
      setShowToggles(false);
    }
  }, [dontHoldBomb, puzzleNum]);

  const ToggleVariants = {
    initial: { opacity: 0, y: 100 }, // start below
    in: { opacity: 1, y: 0 }, // animate into view
    exit: { opacity: 0, y: 100 }, // animate below again
  };

  const [overlay, setOverlay] = useState(false);
  const OverlayVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const checkPasscode = () => {
    if (Object.values(correctPuzzleValues).every((value) => value === true)) {
      navigate('/homescreen');
    } else {
      // TODO: make red overlay
      // alert('fails');
      if(import.meta.env.DEV) {
        alert(JSON.stringify(correctPuzzleValues));
      }

      setOverlay(true);
      playAudio(new Audio(explosionSFX), 1, 0);

      setPuzzlesDone({ ...defaultPuzzlesState });
      setCorrectPuzzleValues({ ...defaultPuzzlesState });

      // 5 seconds set it false again
      setTimeout(() => {
        setOverlay(false);
      }, 4000);
    }
    playAudio(new Audio(clickSFX), 1, 0);
  };

  return (
    <div
      className="passcode_screen"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence>
        {overlay && (
          <motion.div
            className="pass_error_overlay"
            key={'pass-overlay-unique-key'}
            initial="initial"
            animate="in"
            exit="exit"
            variants={OverlayVariants}
            transition={{ duration: 0.4 }}
          ></motion.div>
        )}
      </AnimatePresence>
      <div className="pass_bomb_wrapper">
        <Bomb
          side={side}
          setPuzzleNum={setPuzzleNum}
          setDontHoldBomb={setDontHoldBomb}
          setShowToggles={setShowToggles}
          dontHoldBomb={dontHoldBomb}
          puzzlesDone={puzzlesDone}
        />
      </div>

      {/* Puzzles */}
      <Modal
        closeModal={() => {
          clearPuzzle();
          setPuzzlesDone({
            ...puzzlesDone,
            timer: true,
          });
        }}
        isVisible={puzzleNum === 1}
      >
        <Timer
          setPuzzleValue={(value) => {
            setCorrectPuzzleValues({
              ...correctPuzzleValues,
              timer: value.timeLeft > 0 && value.passcode.slice(-4) === '8521',
            });
          }}
        />
      </Modal>

      <Modal
        closeModal={() => {
          clearPuzzle();
          setPuzzlesDone({
            ...puzzlesDone,
            compassWires: true,
          });
        }}
        isVisible={puzzleNum === 2}
      >
        <CompassWires
          setPuzzleValue={(value) => {
            // Correct answers with the expected values
            const compassAns = [
              { id: 'res-1', value: 68 },
              { id: 'res-5', value: 256 },
              { id: 'res-6', value: 145 },
            ];

            // iterate through every object and check via indices to make sure
            // correct order
            const isCorrect =
              value.length === compassAns.length &&
              value.every(
                (val, index) =>
                  val.resistorId === compassAns[index].id &&
                  Math.abs(val.heading - compassAns[index].value) <= 3 // ±3 buffer (for my shaky hands)
              );

            setCorrectPuzzleValues({
              ...correctPuzzleValues,
              compassWires: isCorrect,
            });
          }}
        />
      </Modal>

      <Modal
        closeModal={() => {
          clearPuzzle();
          setPuzzlesDone({
            ...puzzlesDone,
            cutWire: true,
          });
        }}
        isVisible={puzzleNum === 3}
      >
        <CutWire
          setPuzzleValue={(value) => {
            setCorrectPuzzleValues({
              ...correctPuzzleValues,
              cutWire:
                value.redIsCut && value.yellowIsCut && !value.purpleIsCut,
            });
          }}
        />
      </Modal>

      <Modal
        closeModal={() => {
          clearPuzzle();
          setPuzzlesDone({
            ...puzzlesDone,
            mazeGame: true,
          });
        }}
        isVisible={puzzleNum === 4}
      >
        <MazeGame
          setPuzzleValue={(value) => {
            setCorrectPuzzleValues({
              ...correctPuzzleValues,
              mazeGame: value.x === 4 && value.y === 3,
            });
          }}
        ></MazeGame>
      </Modal>

      <Modal
        closeModal={() => {
          clearPuzzle();
          setPuzzlesDone({
            ...puzzlesDone,
            number: true,
          });
        }}
        isVisible={puzzleNum === 5}
      >
        <Number
          setPuzzleValue={(value) => {
            setCorrectPuzzleValues({
              ...correctPuzzleValues,
              number: value.prediction >= 0.9 && value.number === 2,
            });

            if(import.meta.env.DEV) {
              alert(JSON.stringify(value));
            }
          }}
        ></Number>
      </Modal>

      <Modal
        closeModal={() => {
          clearPuzzle();
          setPuzzlesDone({
            ...puzzlesDone,
            lightSensor: true,
          });
        }}
        isVisible={puzzleNum === 6}
      >
        <LightSensor
          setPuzzleValue={(value) => {
            const { lux1, lux2, lux3 } = value;

            const isCorrect =
              lux1 >= 1000 &&
              lux1 < 2000 &&
              lux2 >= 3000 &&
              lux2 < 4000 &&
              lux3 >= 5000;

            setCorrectPuzzleValues({
              ...correctPuzzleValues,
              lightSensor: isCorrect,
            });
          }}
        />
      </Modal>

      <div className="passcode__attempt">
        <ControlBtn
          text={'Reset'}
          color={28}
          handleClick={() => {
            setPuzzlesDone({ ...defaultPuzzlesState });
            setCorrectPuzzleValues({ ...defaultPuzzlesState });
            playAudio(new Audio(clickSFX), 1, 0);
          }}
        />
        <ControlBtn text={'Defuse'} handleClick={checkPasscode} />
      </div>

      <AnimatePresence>
        {showToggles && !dontHoldBomb && !puzzleNum && (
          <motion.div
            key={'toggle-unique-key'}
            className="passcode__toggles"
            initial="initial"
            animate="in"
            exit="exit"
            variants={ToggleVariants}
            transition={{ duration: 0.4 }}
          >
            <Toggles isDisabled={dontHoldBomb} side={side} setSide={setSide} />
          </motion.div>
        )}
      </AnimatePresence>

      {/*<div>truth: {correctPuzzleValues.lightSensor ? 'true' : 'false'}</div>*/}
    </div>
  );
};

export default Passcode;
