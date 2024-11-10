import './Light.scss';
const Light = ({ done = false }) => {
  return <div className={`light ${done ? 'light--blue' : ''}`}></div>;
};

export default Light;
