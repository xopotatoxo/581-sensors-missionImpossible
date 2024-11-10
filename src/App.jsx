import './App.scss';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import Passcode from './pages/passcode/Passcode.jsx';
import HomeScreen from './pages/homescreen/HomeScreen.jsx';
import LockScreen from './pages/lockscreen/LockScreen.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function App() {
  const LockscreenVariants = {
    initial: { opacity: 0, y: -100 }, // start above
    in: { opacity: 1, y: 0 }, // animate into view
    exit: { opacity: 0, y: -100 }, // animate above again
  };

  const PasscodeVariants = {
    initial: { opacity: 0, y: 100 }, // start below
    in: { opacity: 1, y: 0 }, // animate into view
    exit: { opacity: 0, y: 100 }, // animate below again
  };

  const HomeScreenVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const AnimatedRoute = ({ children, variants, duration }) => {
    const location = useLocation();

    return (
      <motion.div
        key={location.key} // key for exit animations with presence
        initial="initial"
        animate="in"
        exit="exit"
        variants={variants}
        transition={{ duration: duration }}
      >
        {children}
      </motion.div>
    );
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AnimatedRoute variants={LockscreenVariants} duration={0.4}>
          <LockScreen />
        </AnimatedRoute>
      ),
    },
    {
      path: '/passcode',
      element: (
        <AnimatedRoute variants={PasscodeVariants} duration={0.4}>
          <Passcode />
        </AnimatedRoute>
      ),
    },
    {
      path: '/homescreen',
      element: (
        <AnimatedRoute variants={HomeScreenVariants} duration={1.5}>
          <HomeScreen />
        </AnimatedRoute>
      ),
    },
  ]);

  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AnimatePresence>
      {!isPortrait ? (
        <div className="app_rotation_prompt">
          <p>
            This site works best in portrait! Please rotate your device to
            portrait mode and disable auto-rotate on your phone.
          </p>
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </AnimatePresence>
  );
}

export default App;
