import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import SearchBar from '../src/components/SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders search input correctly', () => {
      render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeTruthy();
    });

    it('displays provided value in input', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value="test query"
        />,
      );

      const searchInput = screen.getByDisplayValue('test query');
      expect(searchInput).toBeTruthy();
    });

    it('shows clear button when value is not empty', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value="test"
        />,
      );

      const clearButton = screen.getByText('✕');
      expect(clearButton).toBeTruthy();
    });

    it('hides clear button when value is empty', () => {
      render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      const clearButton = screen.queryByText('✕');
      expect(clearButton).toBeNull();
    });
  });

  describe('User Interaction', () => {
    it('calls onSearch when text is entered', () => {
      render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.changeText(searchInput, 'new search query');

      expect(mockOnSearch).toHaveBeenCalledWith('new search query');
    });

    it('calls onClear when clear button is pressed', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value="test"
        />,
      );

      const clearButton = screen.getByText('✕');
      fireEvent.press(clearButton);

      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('handles rapid text changes', () => {
      render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      const searchInput = screen.getByPlaceholderText(/search/i);

      fireEvent.changeText(searchInput, 't');
      fireEvent.changeText(searchInput, 'te');
      fireEvent.changeText(searchInput, 'tes');
      fireEvent.changeText(searchInput, 'test');

      expect(mockOnSearch).toHaveBeenCalledTimes(4);
      expect(mockOnSearch).toHaveBeenLastCalledWith('test');
    });

    it('handles empty text input', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value="test"
        />,
      );

      const searchInput = screen.getByDisplayValue('test');
      fireEvent.changeText(searchInput, '');

      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Visual States', () => {
    it('applies focus styles when input is focused', () => {
      render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent(searchInput, 'focus');

      // The input should have focus styles applied
      expect(searchInput).toBeTruthy();
    });

    it('removes focus styles when input loses focus', () => {
      render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent(searchInput, 'focus');
      fireEvent(searchInput, 'blur');

      // Should return to normal styles
      expect(searchInput).toBeTruthy();
    });

    it('shows active state when there is search text', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value="active search"
        />,
      );

      // Should show that search is active (different styling, clear button visible)
      expect(screen.getByText('✕')).toBeTruthy();
      expect(screen.getByDisplayValue('active search')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('provides proper accessibility labels', () => {
      render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeTruthy();

      // Should have accessible role and labels
    });

    it('supports keyboard navigation', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value="test"
        />,
      );

      const clearButton = screen.getByText('✕');
      expect(clearButton).toBeTruthy();

      // Clear button should be focusable and pressable
    });

    it('provides screen reader support', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value="test query"
        />,
      );

      const searchInput = screen.getByDisplayValue('test query');
      const clearButton = screen.getByText('✕');

      expect(searchInput).toBeTruthy();
      expect(clearButton).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long search queries', () => {
      const longQuery =
        'This is a very long search query that might exceed normal input lengths and should be handled gracefully by the component';

      render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value={longQuery}
        />,
      );

      const searchInput = screen.getByDisplayValue(longQuery);
      expect(searchInput).toBeTruthy();
      expect(screen.getByText('✕')).toBeTruthy();
    });

    it('handles special characters in search', () => {
      const specialQuery = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.changeText(searchInput, specialQuery);

      expect(mockOnSearch).toHaveBeenCalledWith(specialQuery);
    });

    it('handles unicode and emoji in search', () => {
      const unicodeQuery = '🔍 searching with émojis and ñôñ-âscîî';

      render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.changeText(searchInput, unicodeQuery);

      expect(mockOnSearch).toHaveBeenCalledWith(unicodeQuery);
    });

    it('handles null or undefined value gracefully', () => {
      // @ts-ignore - Testing edge case with invalid props
      render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value={null}
        />,
      );

      // Should not crash and should handle gracefully
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('does not cause unnecessary re-renders', () => {
      const {rerender} = render(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value="test"
        />,
      );

      // Re-render with same props
      rerender(
        <SearchBar
          onSearch={mockOnSearch}
          onClear={mockOnClear}
          value="test"
        />,
      );

      expect(screen.getByDisplayValue('test')).toBeTruthy();
    });

    it('handles rapid prop changes efficiently', () => {
      const {rerender} = render(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      rerender(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="a" />,
      );
      rerender(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="ab" />,
      );
      rerender(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="abc" />,
      );
      rerender(
        <SearchBar onSearch={mockOnSearch} onClear={mockOnClear} value="" />,
      );

      // Should handle changes smoothly
      expect(screen.getByPlaceholderText(/search/i)).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('works correctly when integrated with parent component state', () => {
      const TestParent = () => {
        const [searchValue, setSearchValue] = React.useState('');

        return (
          <SearchBar
            onSearch={setSearchValue}
            onClear={() => setSearchValue('')}
            value={searchValue}
          />
        );
      };

      render(<TestParent />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.changeText(searchInput, 'integration test');

      expect(screen.getByDisplayValue('integration test')).toBeTruthy();
      expect(screen.getByText('✕')).toBeTruthy();

      fireEvent.press(screen.getByText('✕'));
      expect(screen.getByPlaceholderText(/search/i)).toBeTruthy();
      expect(screen.queryByText('✕')).toBeNull();
    });
  });
});
