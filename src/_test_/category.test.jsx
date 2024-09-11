import { render, act, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';

import { renderHook, act } from '@testing-library/react-hooks';

// Custom Hook (for context, since it's related to the test case)
const useDebouncedSearch = (searchQuery, setDebouncedSearchQuery, setCurrentPage) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery === "") {
        setDebouncedSearchQuery(searchQuery);
        setCurrentPage(0);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
};

// Test Suite
describe('useDebouncedSearch Hook', () => {
  it('should clean up timeout on unmount', () => {
    // Mock functions for setDebouncedSearchQuery and setCurrentPage
    const setDebouncedSearchQuery = jest.fn();
    const setCurrentPage = jest.fn();

    // Use fake timers for controlling the debounce
    jest.useFakeTimers();

    // Render the hook and set the initial search query
    const { result, unmount } = renderHook(({ searchQuery }) => {
      const [search, setSearch] = useState(searchQuery);
      useDebouncedSearch(search, setDebouncedSearchQuery, setCurrentPage);

      return { setSearch };
    }, { initialProps: { searchQuery: '' } });

    // Trigger the hook with search query of length 3
    act(() => {
      result.current.setSearch('abc');
    });

    // Fast-forward time by 300ms to simulate debounce effect
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Ensure that the mock functions are called
    expect(setDebouncedSearchQuery).toHaveBeenCalledWith('abc');
    expect(setCurrentPage).toHaveBeenCalledWith(0);

    // Now, unmount the hook and check if cleanup occurs properly
    unmount();

    // Ensure no timers are left running after unmount
    expect(clearTimeout).toHaveBeenCalledTimes(1);

    // Restore real timers after test
    jest.useRealTimers();
  });
});
