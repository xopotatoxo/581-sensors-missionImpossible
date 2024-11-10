import { useEffect, useState } from 'react';
import { FaSun } from 'react-icons/fa';
import './Clock.scss';

const Clock = () => {
  const [dateTime, setDateTime] = useState({
    date: '',
    time: '',
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format date with NA locale
      const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      // Format 12-hour clock with no seconds
      let time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      time = time.replace(/ AM| PM/, '');

      setDateTime({ date, time });
    };

    // Call function on mount to set date and time
    updateDateTime();

    // Call function every second to update
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div className="lockscreen__time">{dateTime.time}</div>
      <div className="lockscreen__date">
        {dateTime.date}
        <FaSun />
      </div>
    </div>
  );
};

export default Clock;
