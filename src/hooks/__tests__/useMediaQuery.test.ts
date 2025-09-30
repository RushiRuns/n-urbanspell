import { renderHook, act } from '@testing-library/react';
import useMediaQuery from '../useMediaQuery';

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  const mockMediaQueryList = {
    matches,
    media: '',
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => mockMediaQueryList),
  });

  return mockMediaQueryList;
};

describe('useMediaQuery', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should return true when media query matches', () => {
    const mockMediaQueryList = mockMatchMedia(true);
    
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    
    expect(result.current).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should return false when media query does not match', () => {
    const mockMediaQueryList = mockMatchMedia(false);
    
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    
    expect(result.current).toBe(false);
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should update when media query changes', () => {
    const mockMediaQueryList = mockMatchMedia(false);
    
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    
    expect(result.current).toBe(false);
    
    // Simulate media query change
    act(() => {
      const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];
      changeHandler({ matches: true } as MediaQueryListEvent);
    });
    
    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const mockMediaQueryList = mockMatchMedia(true);
    
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    
    unmount();
    
    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle SSR environment gracefully', () => {
    // Mock window as undefined to simulate SSR
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    
    expect(result.current).toBe(false);
    
    // Restore window
    global.window = originalWindow;
  });
});