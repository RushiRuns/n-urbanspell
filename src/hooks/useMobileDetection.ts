import useMediaQuery from './useMediaQuery';

/**
 * Custom hook to detect mobile screens (< 768px)
 * @returns boolean indicating if the current screen is mobile size
 */
const useMobileDetection = (): boolean => {
  return useMediaQuery('(max-width: 767px)');
};

export default useMobileDetection;