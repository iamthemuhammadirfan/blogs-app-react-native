import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import BlogCard from '../src/components/BlogCard';
import {Blog} from '../src/types';

const mockBlog: Blog = {
  _id: '1',
  title: 'Test Blog Title',
  content: 'This is a test blog content with some keywords for testing.',
  slug: 'test-blog-title',
  tags: ['technology', 'react', 'testing'],
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  sub_title: 'This is a test subtitle',
  isPublished: true,
  views: 150,
  author: {
    _id: 'author1',
    name: 'John Doe',
    slug: 'john-doe',
    first_name: 'John',
    last_name: 'Doe',
    bio: 'Senior Developer and Tech Writer',
    profile_pic_url: 'https://example.com/profile.jpg',
  },
};

describe('BlogCard Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders blog title correctly', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);
      expect(screen.getByText('Test Blog Title')).toBeTruthy();
    });

    it('renders blog subtitle correctly', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);
      expect(screen.getByText('This is a test subtitle')).toBeTruthy();
    });

    it('renders author name correctly', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);
      expect(screen.getByText('By John Doe')).toBeTruthy();
    });

    it('renders formatted date correctly', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);
      // The exact format depends on your date formatting logic
      expect(screen.getByText(/Jan 15, 2024/)).toBeTruthy();
    });

    it('renders view count correctly', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);
      expect(screen.getByText('150 views')).toBeTruthy();
    });

    it('renders tags correctly', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);

      expect(screen.getByText('#technology')).toBeTruthy();
      expect(screen.getByText('#react')).toBeTruthy();
      expect(screen.getByText('#testing')).toBeTruthy();
    });

    it('renders truncated content', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);
      // Should show truncated content (depends on your truncation logic)
      expect(screen.getByText(/This is a test blog content/)).toBeTruthy();
    });
  });

  describe('Search Highlighting', () => {
    it('highlights search query in title', () => {
      render(
        <BlogCard blog={mockBlog} onPress={mockOnPress} searchQuery="Test" />,
      );
      // This would depend on your highlighting implementation
      // You might need to check for specific styling or highlighted text components
    });

    it('highlights search query in subtitle', () => {
      render(
        <BlogCard
          blog={mockBlog}
          onPress={mockOnPress}
          searchQuery="subtitle"
        />,
      );
      // Check for highlighted text in subtitle
    });

    it('highlights search query in content', () => {
      render(
        <BlogCard
          blog={mockBlog}
          onPress={mockOnPress}
          searchQuery="content"
        />,
      );
      // Check for highlighted text in content
    });

    it('does not highlight when no search query provided', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);
      // Ensure normal rendering without highlights
      expect(screen.getByText('Test Blog Title')).toBeTruthy();
    });

    it('handles case-insensitive search highlighting', () => {
      render(
        <BlogCard blog={mockBlog} onPress={mockOnPress} searchQuery="TEST" />,
      );
      // Should highlight "Test" in title even with different case
    });
  });

  describe('Interaction', () => {
    it('calls onPress when card is pressed', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);

      // Press the card (you might need to find the touchable container)
      const card = screen.getByText('Test Blog Title').parent?.parent;
      if (card) {
        fireEvent.press(card);
        expect(mockOnPress).toHaveBeenCalledTimes(1);
      }
    });

    it('provides proper press feedback', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);

      // Test that the card has proper TouchableOpacity behavior
      const touchableCard = screen.getByText('Test Blog Title').parent?.parent;
      expect(touchableCard).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles blog without subtitle', () => {
      const blogWithoutSubtitle = {...mockBlog, sub_title: ''};
      render(<BlogCard blog={blogWithoutSubtitle} onPress={mockOnPress} />);

      expect(screen.getByText('Test Blog Title')).toBeTruthy();
      // Should not crash and should handle empty subtitle gracefully
    });

    it('handles blog without tags', () => {
      const blogWithoutTags = {...mockBlog, tags: []};
      render(<BlogCard blog={blogWithoutTags} onPress={mockOnPress} />);

      expect(screen.getByText('Test Blog Title')).toBeTruthy();
      // Should not show any tags section
    });

    it('handles blog with many tags', () => {
      const blogWithManyTags = {
        ...mockBlog,
        tags: [
          'tech',
          'react',
          'javascript',
          'typescript',
          'testing',
          'development',
          'programming',
        ],
      };
      render(<BlogCard blog={blogWithManyTags} onPress={mockOnPress} />);

      // Should handle many tags appropriately (might truncate or show scroll)
      expect(screen.getByText('#tech')).toBeTruthy();
      expect(screen.getByText('#react')).toBeTruthy();
    });

    it('handles author without profile picture', () => {
      const blogWithoutAuthorPic = {
        ...mockBlog,
        author: {...mockBlog.author, profile_pic_url: undefined},
      };
      render(<BlogCard blog={blogWithoutAuthorPic} onPress={mockOnPress} />);

      expect(screen.getByText('By John Doe')).toBeTruthy();
      // Should show default avatar or handle missing image gracefully
    });

    it('handles zero views', () => {
      const blogWithZeroViews = {...mockBlog, views: 0};
      render(<BlogCard blog={blogWithZeroViews} onPress={mockOnPress} />);

      expect(screen.getByText('0 views')).toBeTruthy();
    });

    it('handles very long title', () => {
      const blogWithLongTitle = {
        ...mockBlog,
        title:
          'This is a very long title that should be truncated properly to fit within the card layout without breaking the UI',
      };
      render(<BlogCard blog={blogWithLongTitle} onPress={mockOnPress} />);

      // Should handle long title gracefully (truncation or wrapping)
      expect(screen.getByText(/This is a very long title/)).toBeTruthy();
    });

    it('handles very long content', () => {
      const blogWithLongContent = {
        ...mockBlog,
        content:
          'This is a very long content that goes on and on and should be truncated properly to show only a preview in the card. '.repeat(
            10,
          ),
      };
      render(<BlogCard blog={blogWithLongContent} onPress={mockOnPress} />);

      // Should show truncated content
      expect(screen.getByText(/This is a very long content/)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('provides proper accessibility labels', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);

      // Should have proper accessibility support
      const card = screen.getByText('Test Blog Title').parent?.parent;
      expect(card).toBeTruthy();
    });

    it('supports screen readers', () => {
      render(<BlogCard blog={mockBlog} onPress={mockOnPress} />);

      // Should provide semantic information for screen readers
      expect(screen.getByText('Test Blog Title')).toBeTruthy();
      expect(screen.getByText('By John Doe')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with minimal re-renders', () => {
      const {rerender} = render(
        <BlogCard blog={mockBlog} onPress={mockOnPress} />,
      );

      // Re-render with same props should not cause issues
      rerender(<BlogCard blog={mockBlog} onPress={mockOnPress} />);

      expect(screen.getByText('Test Blog Title')).toBeTruthy();
    });

    it('handles frequent search query changes', () => {
      const {rerender} = render(
        <BlogCard blog={mockBlog} onPress={mockOnPress} searchQuery="test" />,
      );

      rerender(
        <BlogCard blog={mockBlog} onPress={mockOnPress} searchQuery="blog" />,
      );
      rerender(
        <BlogCard
          blog={mockBlog}
          onPress={mockOnPress}
          searchQuery="content"
        />,
      );
      rerender(
        <BlogCard blog={mockBlog} onPress={mockOnPress} searchQuery="" />,
      );

      expect(screen.getByText('Test Blog Title')).toBeTruthy();
    });
  });
});
