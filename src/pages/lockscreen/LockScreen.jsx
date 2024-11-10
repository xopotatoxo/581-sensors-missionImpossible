import './LockScreen.scss';
import { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa6';
import { MdNetworkWifi } from 'react-icons/md';
import { MdSignalCellular3Bar } from 'react-icons/md';
import { MdBattery90 } from 'react-icons/md';
import { FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Clock from '../../components/clock/Clock.jsx';

const LockScreen = () => {
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
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > minSwipeDistance;
    if (isSwipeUp) {
      //console.log('swiping')
      navigate('/passcode');
    }
  };

  return (
    <div
      className="lockscreen"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="lockscreen__info">
        <MdNetworkWifi />
        <MdSignalCellular3Bar />
        <MdBattery90 />
      </div>
      <div className="lockscreen__datetime">
        <Clock />
      </div>

      <div className="lockscreen__camera">
        <div className="camera__wrapper">
          <FaCamera size={30} />
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
