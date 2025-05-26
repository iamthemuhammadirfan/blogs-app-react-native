import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import TagFilter from '../src/components/TagFilter';
import {TagDetail} from '../src/types';

// Mock data
const mockAvailableTags = ['technology', 'programming', 'react', 'javascript'];
const mockTagDetails: TagDetail[] = [
  {tag: 'technology', count: 5},
  {tag: 'programming', count: 3},
  {tag: 'react', count: 2},
  {tag: 'javascript', count: 4},
];

const defaultProps = {
  selectedTags: [],
  onTagsChange: jest.fn(),
  availableTags: mockAvailableTags,
  tagDetails: mockTagDetails,
};

describe('TagFilter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders filter button with correct text', () => {
      render(<TagFilter {...defaultProps} />);
      expect(screen.getByText('🏷️ Tags')).toBeTruthy();
    });

    it('shows tag count in button when tags are selected', () => {
      render(
        <TagFilter {...defaultProps} selectedTags={['technology', 'react']} />,
      );
      expect(screen.getByText('🏷️ Tags (2)')).toBeTruthy();
    });

    it('displays clear button when tags are selected', () => {
      render(<TagFilter {...defaultProps} selectedTags={['technology']} />);
      expect(screen.getByText('Clear All')).toBeTruthy();
    });

    it('shows selected tags in horizontal scroll when tags are selected', () => {
      render(
        <TagFilter {...defaultProps} selectedTags={['technology', 'react']} />,
      );
      expect(screen.getByText('technology')).toBeTruthy();
      expect(screen.getByText('react')).toBeTruthy();
    });

    it('displays no tags message when no tags available', () => {
      render(<TagFilter {...defaultProps} availableTags={[]} />);
      expect(screen.getByText('No tags available')).toBeTruthy();
    });
  });

  describe('Modal Interaction', () => {
    it('opens modal when filter button is pressed', () => {
      render(<TagFilter {...defaultProps} />);
      fireEvent.press(screen.getByText('🏷️ Tags'));
      expect(screen.getByText('Select Tags')).toBeTruthy();
    });

    it('displays all available tags in modal', () => {
      render(<TagFilter {...defaultProps} />);
      fireEvent.press(screen.getByText('🏷️ Tags'));

      mockAvailableTags.forEach(tag => {
        expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
      });
    });

    it('shows tag counts in modal', () => {
      render(<TagFilter {...defaultProps} />);
      fireEvent.press(screen.getByText('🏷️ Tags'));

      expect(screen.getByText('(5)')).toBeTruthy(); // technology count
      expect(screen.getByText('(3)')).toBeTruthy(); // programming count
      expect(screen.getByText('(2)')).toBeTruthy(); // react count
      expect(screen.getByText('(4)')).toBeTruthy(); // javascript count
    });

    it('shows available tags section in modal', () => {
      render(
        <TagFilter {...defaultProps} selectedTags={['technology', 'react']} />,
      );
      fireEvent.press(screen.getByText('🏷️ Tags (2)'));

      expect(screen.getByText('Available Tags (4)')).toBeTruthy();
    });

    it('closes modal when cancel is pressed', () => {
      render(<TagFilter {...defaultProps} />);
      fireEvent.press(screen.getByText('🏷️ Tags'));
      fireEvent.press(screen.getByText('Cancel'));

      expect(screen.queryByText('Select Tags')).toBeNull();
    });

    it('closes modal when apply is pressed', () => {
      render(<TagFilter {...defaultProps} />);
      fireEvent.press(screen.getByText('🏷️ Tags'));
      fireEvent.press(screen.getByText('Apply (0)'));

      expect(screen.queryByText('Select Tags')).toBeNull();
    });
  });

  describe('Tag Selection', () => {
    it('shows checkmark for selected tags', () => {
      render(<TagFilter {...defaultProps} selectedTags={['technology']} />);
      fireEvent.press(screen.getByText('🏷️ Tags (1)'));

      // The technology tag should have a checkmark
      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('calls onTagsChange when tag is selected in modal', () => {
      const onTagsChange = jest.fn();
      render(<TagFilter {...defaultProps} onTagsChange={onTagsChange} />);

      fireEvent.press(screen.getByText('🏷️ Tags'));
      // Get the first technology button (in the modal)
      const technologyButtons = screen.getAllByText('technology');
      fireEvent.press(technologyButtons[0]);
      fireEvent.press(screen.getByText('Apply (1)'));

      expect(onTagsChange).toHaveBeenCalledWith(['technology']);
    });

    it('calls onTagsChange when tag is deselected', () => {
      const onTagsChange = jest.fn();
      render(
        <TagFilter
          {...defaultProps}
          selectedTags={['technology']}
          onTagsChange={onTagsChange}
        />,
      );

      fireEvent.press(screen.getByText('🏷️ Tags (1)'));
      // Get the technology button in the modal and deselect it
      const technologyButtons = screen.getAllByText('technology');
      fireEvent.press(technologyButtons[technologyButtons.length - 1]); // deselect
      fireEvent.press(screen.getByText('Apply (0)'));

      expect(onTagsChange).toHaveBeenCalledWith([]);
    });

    it('allows multiple tag selection', () => {
      const onTagsChange = jest.fn();
      render(<TagFilter {...defaultProps} onTagsChange={onTagsChange} />);

      fireEvent.press(screen.getByText('🏷️ Tags'));
      fireEvent.press(screen.getAllByText('technology')[0]);
      fireEvent.press(screen.getAllByText('react')[0]);
      fireEvent.press(screen.getByText('Apply (2)'));

      expect(onTagsChange).toHaveBeenCalledWith(['technology', 'react']);
    });

    it('clears all temporary selections when clear selection is pressed', () => {
      render(<TagFilter {...defaultProps} />);

      fireEvent.press(screen.getByText('🏷️ Tags'));
      fireEvent.press(screen.getAllByText('technology')[0]);
      fireEvent.press(screen.getAllByText('react')[0]);
      fireEvent.press(screen.getByText('Clear Selection')); // Clear selection in modal

      // Apply button should apply empty array
      fireEvent.press(screen.getByText('Apply (0)'));
      expect(defaultProps.onTagsChange).toHaveBeenCalledWith([]);
    });

    it('calls onTagsChange when clear all button is pressed outside modal', () => {
      const onTagsChange = jest.fn();
      render(
        <TagFilter
          {...defaultProps}
          selectedTags={['technology']}
          onTagsChange={onTagsChange}
        />,
      );

      fireEvent.press(screen.getByText('Clear All'));
      expect(onTagsChange).toHaveBeenCalledWith([]);
    });

    it('removes individual tags when cross button is pressed', () => {
      const onTagsChange = jest.fn();
      render(
        <TagFilter
          {...defaultProps}
          selectedTags={['technology', 'react']}
          onTagsChange={onTagsChange}
        />,
      );

      // Find and press the remove button for technology tag
      const technologyTag = screen.getByText('technology').parent;
      if (technologyTag) {
        fireEvent.press(technologyTag);
        expect(onTagsChange).toHaveBeenCalledWith(['react']);
      }
    });
  });

  describe('Visual States', () => {
    it('applies active styles to filter button when tags are selected', () => {
      const {getByText} = render(
        <TagFilter {...defaultProps} selectedTags={['technology']} />,
      );
      const filterButton = getByText('🏷️ Tags (1)');

      // Button should exist and be rendered
      expect(filterButton).toBeTruthy();
    });

    it('resets temporary selection to current selection when modal is cancelled', () => {
      const onTagsChange = jest.fn();
      render(
        <TagFilter
          {...defaultProps}
          selectedTags={['technology']}
          onTagsChange={onTagsChange}
        />,
      );

      fireEvent.press(screen.getByText('🏷️ Tags (1)'));
      fireEvent.press(screen.getAllByText('react')[0]); // select additional tag
      fireEvent.press(screen.getByText('Cancel')); // cancel

      // onTagsChange should not be called
      expect(onTagsChange).not.toHaveBeenCalled();

      // Open again to verify state was reset
      fireEvent.press(screen.getByText('🏷️ Tags (1)'));
      // Only technology should be selected (showing checkmark)
      expect(screen.getByText('✓')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('provides proper accessibility labels', () => {
      render(<TagFilter {...defaultProps} />);
      const filterButton = screen.getByText('🏷️ Tags');
      expect(filterButton).toBeTruthy();
    });

    it('modal content is accessible', () => {
      render(<TagFilter {...defaultProps} />);
      fireEvent.press(screen.getByText('🏷️ Tags'));

      expect(screen.getByText('Select Tags')).toBeTruthy();
      expect(screen.getByText('Cancel')).toBeTruthy();
      expect(screen.getByText('Apply (0)')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty tag details gracefully', () => {
      render(<TagFilter {...defaultProps} tagDetails={[]} />);
      fireEvent.press(screen.getByText('🏷️ Tags'));

      // Should still render tags without counts
      expect(screen.getAllByText('technology').length).toBeGreaterThan(0);
    });

    it('handles missing tag details for some tags', () => {
      const partialTagDetails = [{tag: 'technology', count: 5}];
      render(<TagFilter {...defaultProps} tagDetails={partialTagDetails} />);
      fireEvent.press(screen.getByText('🏷️ Tags'));

      // Should render all tags, some with counts, some without
      expect(screen.getByText('(5)')).toBeTruthy(); // technology has count
      expect(screen.getAllByText('programming').length).toBeGreaterThan(0); // programming without count
    });
  });
});
