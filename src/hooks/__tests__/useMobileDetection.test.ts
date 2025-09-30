import { renderHook } from '@testing-library/react';
import useMobileDetection from '../useMobileDetection';
import useMediaQuery from '../useMediaQuery';

// Mock the useMediaQuery hook
jest.mock('../useMediaQuery');
const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

describe('useMobileDetection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for mobile screens (< 768px)', () => {
    mockUseMediaQuery.mockReturnValue(true);
    
    const { result } = renderHook(() => useMobileDetection());
    
    expect(result.current).toBe(true);
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('should return false for desktop screens (>= 768px)', () => {
    mockUseMediaQuery.mockReturnValue(false);
    
    const { result } = renderHook(() => useMobileDetection());
    
    expect(result.current).toBe(false);
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 767px)');
  });
});