import { ReactP5Wrapper } from '@p5-wrapper/react';
import { useState } from 'react';
import './CutWire.scss';
import flashLightClickSFX from '../../assets/button_click.mp3';
import wireSnipSFX from '../../assets/snip_wire.mp3';
import { playAudio } from '../../utils/useAudio.jsx';

function sketch(p5) {
  let permissionGranted = false;
  let cx, cy;
  let red, yellow, purple;
  let redCut = false,
    yellowCut = false,
    purpleCut = false;
  let flashlightOn = false;
  let setPuzzleValue,
    puzzleValue = {
      redIsCut: false,
      purpleIsCut: false,
      yellowIsCut: false,
    };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);

    cx = p5.width / 2;
    cy = p5.height / 2;

    // DeviceOrientationEvent, DeviceMotionEvent
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      // ios 13 device

      DeviceOrientationEvent.requestPermission()
        .catch(() => {
          // show permission dialog only the first time
          let button = p5.createButton('click to allow access to sensors');
          button.style('font-size', '24px');
          button.center();
          button.mousePressed(requestAccess);
          throw error;
        })
        .then(() => {
          // on any subsequent visits
          permissionGranted = true;
        });
    } else {
      // non ios 13 device
      p5.textSize(48);
      // text("non ios 13 device", 100, 100);
      permissionGranted = true;
    }

    p5.background(255);
  };

  p5.updateWithProps = (props) => {
    flashlightOn = props.flashlightOn;
    setPuzzleValue = props.setPuzzleValue;
  };

  function requestAccess() {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response == 'granted') {
          p5.permissionGranted = true;
        } else {
          p5.permissionGranted = false;
        }
      })
      .catch(console.error);

    this.remove();
  }

  p5.draw = () => {
    p5.clear();
    p5.background(0);

    if (!permissionGranted) return;

    // background(255);

    // rotationX, rotationY
    const dx = p5.constrain(2 * p5.rotationY, -3, 3);
    const dy = p5.constrain(2 * p5.rotationX, -3, 3);
    cx += dx * 2;
    cy += dy * 2;
    cx = p5.constrain(190, 0, p5.width);
    cy = p5.constrain(cy, 0, p5.height);

    function drawWireSegment(color, y, fullHeight, cut) {
      let height;
      let wireY;
      const diff = 99;
      if (cy - diff > y - fullHeight) {
        height = fullHeight - (cy - diff - (y - fullHeight));
        wireY = cy - diff;
      } else {
        height = fullHeight - y + (cy - diff + 198);
        wireY = y - fullHeight;
      }
      height = p5.constrain(height, 0, fullHeight);

      if (cut) {
        p5.fill('white');
      } else {
        p5.fill(color);
      }
      p5.rect(p5.width / 2 - 20, wireY, 40, height);

      return { y: wireY, height: height };
    }

    p5.drawingContext.shadowBlur = 600;
    p5.drawingContext.shadowColor = p5.color(255, 255, 150); // Glow color

    // camera
    p5.noStroke();
    p5.fill('white');
    p5.ellipse(cx + 10, cy, 200, 200);
    p5.stroke('black');

    p5.drawingContext.shadowBlur = 0;

    // the wire
    p5.fill('blue');
    p5.rect(p5.width / 2 - 20, cy - 99, 40, 198);

    const redFullHeight = 80;
    red = drawWireSegment(
      'red',
      (p5.height * 5) / 6,
      redFullHeight,
      puzzleValue.redIsCut
    );
    purple = drawWireSegment(
      'purple',
      (p5.height * 3) / 5,
      redFullHeight,
      puzzleValue.purpleIsCut
    );
    const yellowFullHeight = 80;
    yellow = drawWireSegment(
      'yellow',
      (p5.height * 1) / 3,
      yellowFullHeight,
      puzzleValue.yellowIsCut
    );

    if (!flashlightOn) {
      p5.clear();
      p5.background('black');
    }
  };

  p5.mousePressed = () => {
    if (!flashlightOn) {
      return;
    }

    if (
      p5.mouseX >= p5.width / 2 - 20 &&
      p5.mouseX <= p5.width / 2 + 20 &&
      p5.mouseY >= red.y &&
      p5.mouseY <= red.y + red.height
    ) {
      puzzleValue.redIsCut = true;
      playAudio(new Audio(wireSnipSFX), 1, 1.3);
    } else if (
      p5.mouseX >= p5.width / 2 - 20 &&
      p5.mouseX <= p5.width / 2 + 20 &&
      p5.mouseY >= purple.y &&
      p5.mouseY <= purple.y + purple.height
    ) {
      puzzleValue.purpleIsCut = true;
      playAudio(new Audio(wireSnipSFX), 1, 1.3);
    } else if (
      p5.mouseX >= p5.width / 2 - 20 &&
      p5.mouseX <= p5.width / 2 + 20 &&
      p5.mouseY >= yellow.y &&
      p5.mouseY <= yellow.y + yellow.height
    ) {
      puzzleValue.yellowIsCut = true;
      playAudio(new Audio(wireSnipSFX), 1, 1.3);
    }

    setPuzzleValue(puzzleValue);
  };
}

const CutWire = ({ setPuzzleValue }) => {
  const [flashlightOn, setFlashlightOn] = useState(false);

  return (
    <div className="cut_wire_container">
      <ReactP5Wrapper
        sketch={sketch}
        flashlightOn={flashlightOn}
        setPuzzleValue={setPuzzleValue}
      ></ReactP5Wrapper>

      <button
        onClick={() => {
          setFlashlightOn(!flashlightOn);
          playAudio(new Audio(flashLightClickSFX), 1, 0);
        }}
        className="flashlight__button"
      >
        {flashlightOn ? 'On' : 'Off'}
      </button>
    </div>
  );
};

export default CutWire;
