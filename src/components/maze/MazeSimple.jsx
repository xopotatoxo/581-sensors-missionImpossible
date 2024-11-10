import { useState, useMemo, useEffect } from 'react';
import './Maze.scss';
import Quaternion from 'quaternion';
import ControlBtn from '../controlbtn/ControlBtn.jsx';
import { playAudio } from '../../utils/useAudio.jsx';
import clickSFX from '../../assets/click.mp3';
import blipSFX from '../../assets/retro-blip-2.mp3';

const orientations = [
  ['landscape left', 'landscape right'], // device x-axis points up/down
  ['portrait', 'portrait upside down'], // device y-axis points up/down
  ['display up', 'display down'], // device z axis points up/down
];

const rad = Math.PI / 180;

/**
 * Quaternion computations from below
 * https://stackoverflow.com/questions/56769428/device-orientation-using-quaternion
 * https://stackoverflow.com/questions/41491940/deviceorientationevent-how-to-deal-with-crazy-gamma-when-beta-approaches-hits-9
 * @param setPuzzleValue
 * @returns {JSX.Element}
 * @constructor
 */
export default function MazeGame({ setPuzzleValue }) {
  const [gameId, setGameId] = useState(1);
  const [userPosition, setUserPosition] = useState([3, 3]);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [selectedCellX, setSelectedCellX] = useState(null); // Track selected cell
  const [selectedCellY, setSelectedCellY] = useState(null); // Track selected cell
  const moveDelay = 10000000000; // Delay in milliseconds
  const [targetLocked, setTargetLocked] = useState(false);

  const [angles, setAngles] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [vec, setVec] = useState([0, 0, 0]);
  const [orientation, setOrientation] = useState('');

  const fixedMaze = [
    [
      [0, 1, 1, 0],
      [0, 1, 0, 1],
      [0, 1, 1, 0],
      [0, 1, 1, 1],
      [0, 1, 0, 1],
      [0, 1, 1, 1],
      [0, 1, 0, 1],
    ],
    [
      [1, 1, 0, 0],
      [0, 1, 1, 1],
      [1, 0, 0, 1],
      [1, 1, 1, 0],
      [0, 1, 0, 1],
      [1, 1, 1, 1],
      [0, 1, 0, 1],
    ],
    [
      [0, 1, 1, 0],
      [1, 1, 0, 1],
      [0, 0, 1, 0],
      [1, 1, 1, 1],
      [1, 0, 1, 1],
      [0, 1, 0, 0],
      [1, 0, 1, 1],
    ],
    [
      [1, 1, 0, 0],
      [0, 1, 1, 1],
      [1, 0, 1, 1],
      [0, 1, 1, 1],
      [1, 1, 1, 0],
      [1, 1, 0, 1],
      [0, 1, 1, 0],
    ],
    [
      [0, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 0, 0, 1],
      [1, 1, 1, 0],
      [0, 1, 1, 1],
      [1, 0, 0, 1],
      [1, 1, 0, 1],
    ],
    [
      [1, 1, 0, 0],
      [0, 1, 1, 1],
      [1, 1, 0, 1],
      [0, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 1, 0],
      [1, 1, 0, 1],
    ],
    [
      [0, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 0, 0, 1],
      [1, 1, 1, 0],
      [0, 1, 1, 1],
      [1, 1, 0, 0],
      [1, 1, 1, 1],
    ],
  ];

  const winningCell = [4, 3]; // Bottom-right corner

  const maze = useMemo(() => fixedMaze, [gameId]);
  const maxColIndex = maze[0].length - 1;

  // Set CSS variables for maze rows and columns
  useEffect(() => {
    const mazeRows = maze.length;
    const mazeCols = maze[0].length;
    document.documentElement.style.setProperty('--maze-rows', mazeRows);
    document.documentElement.style.setProperty('--maze-cols', mazeCols);
  }, [maze]);

  useEffect(() => {
    const movePlayer = () => {
      const newPosition = [...userPosition];

      switch (orientation) {
        case 'landscape left':
          newPosition[1] = Math.max(newPosition[1] - 1, 0); // Move left
          break;
        case 'landscape right':
          newPosition[1] = Math.min(newPosition[1] + 1, maze[0].length - 1); // Move right
          break;
        case 'portrait':
          newPosition[0] = Math.min(newPosition[0] + 1, maze.length - 1); // Move down
          break;
        case 'portrait upside down':
          newPosition[0] = Math.max(newPosition[0] - 1, 0); // Move up
          break;
        default:
          break;
      }

      const isSamePosition =
        userPosition.length === newPosition.length &&
        userPosition.every((value, index) => value === newPosition[index]);

      // Check if the new position is valid (not a wall)
      if (
        newPosition[0] >= 0 &&
        newPosition[0] < maze.length &&
        newPosition[1] >= 0 &&
        newPosition[1] < maze[0].length &&
        maze[newPosition[0]][newPosition[1]] !== 1 && // Check if the cell is not a wall
        !isSamePosition
      ) {
        setUserPosition(newPosition);
        playAudio(new Audio(blipSFX), 1, 0);
      }
    };

    const intervalId = setInterval(movePlayer, 200); // Move every 200 ms
    return () => clearInterval(intervalId);
  }, [orientation, userPosition, maze]);

  let permission;

  // Handle device motion
  useEffect(() => {
    const onOrientationChange = (ev) => {
      const q = Quaternion.fromEuler(
        ev.alpha * rad * 1.5,
        ev.beta * rad * 1.5,
        ev.gamma * rad * 1.5,
        'ZXY'
      );

      // Transform an upward-pointing vector to device coordinates
      const vec = q.conjugate().rotateVector([0, 0, 1]);

      // Find the axis with the largest absolute value
      const [value, axis] = vec.reduce(
        (acc, cur, idx) =>
          Math.abs(cur) < Math.abs(acc[0]) ? acc : [cur, idx],
        [0, 0]
      );

      const orientation = orientations[axis][1 * (value < 0)];

      if (!targetLocked) {
        setAngles({ alpha: ev.alpha, beta: ev.beta, gamma: ev.gamma });
        setVec(vec);
        setOrientation(orientation);
      }
    };

    const requestPermission = async () => {
      if (DeviceOrientationEvent.requestPermission) {
        try {
          permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener(
              'deviceorientation',
              onOrientationChange,
              true
            );
          } else {
            console.log('Permission not granted for device orientation.');
          }
        } catch (error) {
          console.error(
            'Error requesting device orientation permission',
            error
          );
        }
      } else {
        window.addEventListener('deviceorientation', onOrientationChange, true);
      }
    };

    requestPermission();
    return () => {
      window.removeEventListener(
        'deviceorientation',
        onOrientationChange,
        true
      );
    };
  }, [permission, targetLocked]);

  const restartGame = () => {
    setGameId((prevId) => prevId + 1);
    setUserPosition([3, 3]);
    setSelectedCellX(null); // Reset selected cell
    setSelectedCellY(null);
  };

  const handleConfirm = () => {
    if (!targetLocked) {
      setTargetLocked(true);

      setSelectedCellX(userPosition[0]);
      setSelectedCellY(userPosition[1]);

      // console.log(userPosition[0]);
      // console.log(userPosition[1]);

      // if (
      //   userPosition[0] === winningCell[0] &&
      //   userPosition[1] === winningCell[1]
      // ) {
      //   console.log('winner winner chicken dinner');
      // }

      setPuzzleValue({
        x: userPosition[0],
        y: userPosition[1],
      });
    } else {
      setTargetLocked(false);
      setSelectedCellX(null);
      setSelectedCellY(null);
    }
    playAudio(new Audio(clickSFX), 1, 0);
  };

  return (
    <div className="maze-bg">
      <div className="maze-container">
        <div className="maze">
          {maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${rowIndex === selectedCellX && colIndex === selectedCellY ? 'selected' : ''}`}
              >
                {userPosition[0] === rowIndex &&
                  userPosition[1] === colIndex && (
                    <div className="player"></div>
                  )}
              </div>
            ))
          )}
        </div>
        <ControlBtn
          text={`${!targetLocked ? 'Select Target' : 'Release Target'}`}
          handleClick={handleConfirm}
        />

        <div className="maze-info">
          <div className="maze-angles">
            {`α = ${angles.alpha?.toFixed(1) || '0.0'}°,
             β = ${angles.beta?.toFixed(1) || '0.0'}°,
              γ = ${angles.gamma?.toFixed(1) || '0.0'}°`}
          </div>
          <div className="maze-orientation">
            ORIENTATION = {orientation.toUpperCase() || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
