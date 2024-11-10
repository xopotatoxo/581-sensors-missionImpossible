// credits: https://github.com/trekhleb/trekhleb.github.io/blob/master/src/posts/2021/gyro-web/components/useDeviceOrientation.ts
import { useCallback, useEffect, useState } from 'react';

const roundAngle = (angle) => {
  if (typeof angle !== 'number') {
    return angle;
  }
  const fractionDigits = 2;
  return +angle.toFixed(fractionDigits);
};

export const useDeviceOrientation = () => {
  const [error, setError] = useState(null);
  const [orientation, setOrientation] = useState(null);
  const [cssTransformInverse, setCssTransformInverse] = useState({});

  const onDeviceOrientation = (event) => {
    const angles = {
      alpha: roundAngle(event.alpha),
      beta: roundAngle(event.beta),
      gamma: roundAngle(event.gamma),
      absolute: event.absolute,
    };
    setOrientation(angles);
    if (
      angles &&
      typeof angles.alpha === 'number' &&
      typeof angles.beta === 'number' &&
      typeof angles.gamma === 'number'
    ) {
      const a = angles.alpha > 180 ? angles.alpha - 360 : angles.alpha;
      const b = angles.beta - 45;
      const g = angles.gamma > 180 ? 360 - angles.gamma : -angles.gamma;

      setCssTransformInverse({
        transform: `rotateX(${b}deg) rotateY(${g}deg) rotateZ(${0}deg)`,
        transition: 'none',
      });
    }
  };

  const revokeAccessAsync = async () => {
    window.removeEventListener('deviceorientation', onDeviceOrientation);
    setOrientation(null);
    setCssTransformInverse({});
  };

  const requestAccessAsync = async () => {
    if (!DeviceOrientationEvent) {
      setError(
        new Error('Device orientation event is not supported by your browser')
      );
      return false;
    }

    // Requesting the permission to access device orientation in iOS.
    // @see: https://developer.apple.com/forums/thread/128376
    if (
      // @ts-ignore
      DeviceOrientationEvent.requestPermission &&
      // @ts-ignore
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      let permission;
      try {
        // @ts-ignore
        permission = await DeviceOrientationEvent.requestPermission();
      } catch (err) {
        // @ts-ignore
        const e = new Error((err && err.message) || 'unknown error');
        setError(e);
        return false;
      }
      if (permission !== 'granted') {
        setError(
          new Error('Request to access the device orientation was rejected')
        );
        return false;
      }
    }

    window.addEventListener('deviceorientation', onDeviceOrientation);

    return true;
  };

  const requestAccess = useCallback(requestAccessAsync, []);
  const revokeAccess = useCallback(revokeAccessAsync, []);

  useEffect(() => {
    return () => {
      revokeAccess();
    };
  }, [revokeAccess]);

  return {
    orientation,
    error,
    requestAccess,
    revokeAccess,
    cssTransformInverse,
  };
};
