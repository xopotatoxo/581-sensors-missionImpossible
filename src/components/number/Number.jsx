import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import './Number.scss';
import Webcam from 'react-webcam';
import { playAudio } from '../../utils/useAudio.jsx';
import cameraClickSFX from '../../assets/camera.mp3';

const URL = 'https://teachablemachine.withgoogle.com/models/HljmOR4Ye/';

const Number = ({ setPuzzleValue }) => {
  const webcamRef = useRef(null);
  const captureButtonRef = useRef(null); // Create a ref for the button
  const videoConstraints = {
    facingMode: "user"
  };
  const [capturing, setCapturing] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(null);

  const loadModel = async () => {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    const modelLoad = await tmImage.load(modelURL, metadataURL);
    setModel(modelLoad);
    setMaxPredictions(modelLoad.getTotalClasses());
    setLoadingModel(false);
  };

  useEffect(() => {
    loadModel();
  },[loadingModel]);


  const checkPhoneUnlock = async () => {
    if(loadingModel) {
      return;
    }

    setCapturing(true);

    function loadImage(url){
      return new Promise((resolve, reject) => {
        let image = new Image();
        image.src = url
        image.onload = () => {
          resolve(image)
        }   
      })
    }

    const captureImgSrc = await webcamRef.current.getScreenshot();
    const image = await loadImage(captureImgSrc);
    let prediction = await model.predict(image);

    let highestProbability = 0;
    let highestClassNumber = 1;

    for (let i = 0; i < maxPredictions; i++) {
      const currentProbability = prediction[i].probability;

      if (currentProbability > highestProbability) {
        highestProbability = currentProbability;
        highestClassNumber = i + 1;
      }
    }

    setPuzzleValue({
      prediction: highestProbability.toFixed(2),
      number: highestClassNumber,
    });

    setCapturing(false);
  };

  return (
    <div className="number-bg">
      <div className="number-container">
        <div className="webcam-container">
          <Webcam
            className="webcam-video"
            audio={false}
            ref={webcamRef}
            mirrored={true}
            videoConstraints={videoConstraints}
            screenshotFormat="image/jpeg"></Webcam>
        </div>
        {!loadingModel ? 
          (
            <button
              className="number-btn"
              onClick={() => {
                checkPhoneUnlock();
                playAudio(new Audio(cameraClickSFX), 1, 0.1);
              }}
              ref={captureButtonRef}
            >
              
              {capturing ? 'Capturing...' : 'Capture'}
            </button>
          ) : null
        }
      </div>
    </div>
  );
};

export default Number;
