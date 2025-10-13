import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to ensure a loader is displayed for a minimum amount of time.
 * @param {boolean} externalLoading - The actual loading state from the data fetch.
 * @param {number} minDuration - The minimum duration in milliseconds to show the loader.
 * @returns {boolean} - A boolean indicating whether the loader should be displayed.
 */
export const useMinLoaderTime = (externalLoading, minDuration = 3000) => {
  const [internalLoading, setInternalLoading] = useState(true);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (externalLoading) {
      startTimeRef.current = Date.now();
      setInternalLoading(true);
    } else {
      const elapsedTime = Date.now() - (startTimeRef.current || Date.now());
      const remainingTime = minDuration - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => setInternalLoading(false), remainingTime);
      } else {
        setInternalLoading(false);
      }
    }
  }, [externalLoading, minDuration]);

  return internalLoading;
};