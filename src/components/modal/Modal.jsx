import './Modal.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { playAudio } from '../../utils/useAudio.jsx';
import clickSFX from '../../assets/click.mp3';

const Modal = ({ children, closeModal, isVisible = false }) => {
  // handles modal animation
  const listVariants = {
    closed: {
      opacity: 0,
      transition: {
        ease: 'easeInOut',
        duration: 0.5,
      },
    },
    open: {
      opacity: 1,
      transition: {
        ease: 'easeInOut',
        duration: 0.5,
      },
    },
  };

  const handleClick = () => {
    closeModal();
    playAudio(new Audio(clickSFX), 1, 0);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="modal-container"
          variants={listVariants}
          initial="closed"
          animate="open"
          exit="closed"
          key={'modal-framer-motion-key'}
        >
          <button className="modal__set-btn" onClick={handleClick}>
            Set
          </button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
