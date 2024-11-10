import './Battery.scss';

const Battery = ({ lux = 0, animate = false }) => {
  const getBatteryColor = (lux) => {
    if (lux >= 5000) return 'fill--green';
    if (lux >= 4000) return 'fill--lime';
    if (lux >= 3000) return 'fill--yellow';
    if (lux >= 2000) return 'fill--orange';
    if (lux >= 1000) return 'fill--red';
    return '';
  };

  return (
    <div className={`battery ${animate ? ' battery--animate' : ''}`}>
      <div className="battery__body">
        {Array.from({ length: 5 }, (_, index) => {
          const threshold = (index + 1) * 1000;
          return (
            <div
              key={index}
              className={`battery__fill ${lux >= threshold ? 'fill--show' : ''} ${getBatteryColor(lux)}`}
            />
          );
        })}
      </div>
      <div className="battery__positive" />
    </div>
  );
};

export default Battery;
