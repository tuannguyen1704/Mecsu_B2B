import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

interface UseScrollPositionReturn {
  position: ScrollPosition;
  isScrolled: boolean;
  scrollDirection: 'up' | 'down' | null;
}

/**
 * Track scroll position and direction
 */
export function useScrollPosition(threshold = 0): UseScrollPositionReturn {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setPosition({
        x: window.scrollX,
        y: currentScrollY,
      });
      
      setIsScrolled(currentScrollY > threshold);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > threshold) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { position, isScrolled, scrollDirection };
}

/**
 * Track scroll visibility (show/hide based on scroll direction)
 */
export function useScrollVisibility(
  hideThreshold = 150,
  showThreshold = 50
): boolean {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < hideThreshold) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        if (currentScrollY < showThreshold) {
          setIsVisible(true);
        } else {
          setIsVisible(true);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideThreshold, showThreshold]);

  return isVisible;
}
