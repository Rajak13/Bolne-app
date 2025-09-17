import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for handling swipe gestures
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {number} options.threshold - Minimum distance for swipe (default: 50)
 * @param {number} options.restraint - Maximum perpendicular distance (default: 100)
 * @param {number} options.allowedTime - Maximum time for swipe (default: 300ms)
 * @returns {Object} - Ref to attach to element and swipe state
 */
export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  restraint = 100,
  allowedTime = 300
} = {}) => {
  const elementRef = useRef(null);
  const [isSwipping, setIsSwipping] = useState(false);
  const swipeData = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    distX: 0,
    distY: 0,
    elapsedTime: 0
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let touchStarted = false;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      swipeData.current = {
        startX: touch.pageX,
        startY: touch.pageY,
        startTime: new Date().getTime(),
        distX: 0,
        distY: 0,
        elapsedTime: 0
      };
      touchStarted = true;
      setIsSwipping(false);
    };

    const handleTouchMove = (e) => {
      if (!touchStarted) return;
      
      const touch = e.touches[0];
      swipeData.current.distX = touch.pageX - swipeData.current.startX;
      swipeData.current.distY = touch.pageY - swipeData.current.startY;
      
      // Set swipping state if movement is significant
      if (Math.abs(swipeData.current.distX) > 10) {
        setIsSwipping(true);
      }
    };

    const handleTouchEnd = (e) => {
      if (!touchStarted) return;
      
      touchStarted = false;
      setIsSwipping(false);
      
      swipeData.current.elapsedTime = new Date().getTime() - swipeData.current.startTime;
      
      // Check if swipe meets criteria
      if (swipeData.current.elapsedTime <= allowedTime) {
        // Check if horizontal distance is sufficient and vertical distance is not too much
        if (Math.abs(swipeData.current.distX) >= threshold && Math.abs(swipeData.current.distY) <= restraint) {
          if (swipeData.current.distX > 0) {
            // Right swipe
            onSwipeRight?.(swipeData.current);
          } else {
            // Left swipe
            onSwipeLeft?.(swipeData.current);
          }
        }
      }
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, restraint, allowedTime]);

  return {
    ref: elementRef,
    isSwipping
  };
};

export default useSwipeGesture;