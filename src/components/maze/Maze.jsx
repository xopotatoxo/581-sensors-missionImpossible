import { useState, useMemo, useEffect } from 'react';
import './Maze.scss';

export default function MazeGame({ setPuzzleValue }) {
  const [gameId, setGameId] = useState(1);
  const [status, setStatus] = useState('playing');
  const [userPosition, setUserPosition] = useState([0, 3]);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [attempts, setAttempts] = useState(0); // Track number of attempts
  const [selectedCellX, setSelectedCellX] = useState(null); // Track selected cell
  const [selectedCellY, setSelectedCellY] = useState(null); // Track selected cell
  const moveDelay = 10000000000; // Delay in milliseconds
  const [targetLocked, setTargetLocked] = useState(false);

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

  //const userPosition = useState([0, 0]); // Starting at top-left for example
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

  // Define the winning cell
  //const winningCell = [4, 5]; // Change this to any valid cell as the winning position

  // Move player with delay
  const movePlayer = (gamma, beta) => {
    const currentTime = Date.now();

    // Prevent rapid movement
    if (currentTime - lastMoveTime < moveDelay) {
      return;
    }

    setLastMoveTime(currentTime);
    let newPosition = [...userPosition];

    // Move right while gamma indicates right movement
    while (gamma > 5) {
      newPosition[1] = Math.min(newPosition[1] + 1, maze[0].length - 1); // Move right
      gamma -= 5; // Decrease gamma to eventually exit the loop
    }

    // Move left while gamma indicates left movement
    while (gamma < -5) {
      newPosition[1] = Math.max(newPosition[1] - 1, 0); // Move left
      gamma += 5; // Increase gamma to eventually exit the loop
    }

    // Move down while beta indicates downward movement
    while (beta > 5) {
      newPosition[0] = Math.min(newPosition[0] + 1, maze.length - 1); // Move down
      beta -= 5; // Decrease beta to eventually exit the loop
    }

    // Move up while beta indicates upward movement
    while (beta < -5) {
      newPosition[0] = Math.max(newPosition[0] - 1, 0); // Move up
      beta += 5; // Increase beta to eventually exit the loop
    }

    // Only update user position if it's within bounds
    if (
      newPosition[0] >= 0 &&
      newPosition[0] < maze.length &&
      newPosition[1] >= 0 &&
      newPosition[1] < maze[0].length &&
      maze[newPosition[0]][newPosition[1]] !== 1 // Check if the cell is not a wall
    ) {
      setUserPosition(newPosition);
      //setSelectedCell(newPosition);
    }
  };

  let permission;

  // Handle device motion
  useEffect(() => {
    const handleDeviceMotion = (event) => {
      const { beta, gamma } = event; // Get beta (x-axis) and gamma (z-axis)
      if (!targetLocked) {
        movePlayer(gamma, beta);
      }
    };

    const requestPermission = async () => {
      if (DeviceOrientationEvent.requestPermission) {
        try {
          permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceMotion);
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
        window.addEventListener('deviceorientation', handleDeviceMotion);
      }
    };

    requestPermission();
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceMotion);
    };
  }, [permission]);

  const restartGame = () => {
    setGameId((prevId) => prevId + 1);
    setUserPosition([0, 0]);
    setStatus('playing');
    setAttempts(0); // Reset attempts
    setSelectedCellX(null); // Reset selected cell
    setSelectedCellY(null);
  };

  // Function to handle selecting a cell
  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCellX(rowIndex);
    setSelectedCellY(colIndex);
    if (rowIndex === winningCell[0] && colIndex === winningCell[1]) {
      setStatus('won'); // Winning condition remains the same
    } else {
      setStatus('select');
    }
  };

  const handleConfirm = () => {
    setTargetLocked(!targetLocked);
    setSelectedCellX(userPosition[0]);
    setSelectedCellY(userPosition[1]);

    setPuzzleValue({
      x: userPosition[0],
      y: userPosition[1],
    });

    // if (userPosition[0] === winningCell[0] && userPosition[1] === winningCell[1]) {
    //   console.log("You've won!");
    //   setStatus("won");
    // } else {
    //   if (attempts < 2) {
    //     setAttempts((prev) => prev + 1); // Increment attempts
    //     setStatus("select")
    //     console.log(`Incorrect! You have ${2 - attempts} attempts left.`);
    //   } else {
    //     console.log("Not allowed!");
    //     setStatus("notAllowed"); // Set a status for "not allowed"
    //   }
    // }
  };

  return (
    <div className="maze-container">
      <div className="maze">
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell 
                ${status === 'won' && rowIndex === winningCell[0] && colIndex === winningCell[1] ? 'winning-cell' : ''} 
                ${status === 'select' && rowIndex === selectedCellX && colIndex === selectedCellY ? 'selected' : ''}
              `}
              //onClick={() => handleConfirm()}
            >
              {userPosition[0] === rowIndex && userPosition[1] === colIndex && (
                <div className="player"></div>
              )}
            </div>
          ))
        )}
      </div>

      {status === 'won' && (
        <div className="win-message">
          <h2>You've won!</h2>
          <div className="hint-message">
            The clicked cell was row {selectedCellX} and column {selectedCellY}
          </div>
          <button className="maze-btn" onClick={restartGame}>
            Restart
          </button>
        </div>
      )}

      {status === 'select' && (
        <div className="win-message">
          <h2>You Made a Choice!</h2>
          <div className="hint-message">
            The clicked cell was row {selectedCellX} and column {selectedCellY}
          </div>
          <button className="maze-btn" onClick={restartGame}>
            Restart
          </button>
        </div>
      )}

      {status === 'notAllowed' && (
        <div className="not-allowed-message">
          <h2>Not allowed!</h2>
          <button className="maze-btn" onClick={restartGame}>
            Restart
          </button>
        </div>
      )}

      <button className="maze-btn" onClick={handleConfirm}>
        {!targetLocked ? 'Set Target' : 'Release Target'}
      </button>

      {status === 'notAllowed' && attempts >= 3 && (
        <div className="attempts-message">
          <h3>You have used all your attempts.</h3>
        </div>
      )}
    </div>
  );
}
