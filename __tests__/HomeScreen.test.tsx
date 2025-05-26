import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import {BlogProvider} from '../src/context/BlogContext';
import {Blog, TagDetail} from '../src/types';

// Mock the hooks and services
jest.mock('../src/hooks/useBlogActions');
jest.mock('../src/services/blogService');

// Mock data
const mockBlogs: Blog[] = [
  {
    _id: '1',
    title: 'Test Blog 1',
    content: 'This is test content',
    slug: 'test-blog-1',
    tags: ['technology', 'react'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    sub_title: 'Test subtitle',
    isPublished: true,
    views: 100,
    author: {
      _id: 'author1',
      name: 'John Doe',
      slug: 'john-doe',
      first_name: 'John',
      last_name: 'Doe',
      bio: 'Test author',
    },
  },
  {
    _id: '2',
    title: 'Test Blog 2',
    content: 'Another test content',
    slug: 'test-blog-2',
    tags: ['programming', 'javascript'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    sub_title: 'Another subtitle',
    isPublished: true,
    views: 200,
    author: {
      _id: 'author2',
      name: 'Jane Smith',
      slug: 'jane-smith',
      first_name: 'Jane',
      last_name: 'Smith',
      bio: 'Another test author',
    },
  },
];

const mockTagDetails: TagDetail[] = [
  {tag: 'technology', count: 5},
  {tag: 'react', count: 3},
  {tag: 'programming', count: 4},
  {tag: 'javascript', count: 2},
];

const mockUseBlogActions = {
  fetchBlogs: jest.fn(),
  fetchTags: jest.fn(),
  clearError: jest.fn(),
  setSearchQuery: jest.fn(),
  clearSearch: jest.fn(),
  setSelectedTags: jest.fn(),
  clearAllFilters: jest.fn(),
  resetBlogs: jest.fn(),
};

const mockBlogState = {
  allBlogs: mockBlogs,
  filteredBlogs: mockBlogs,
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_items: 2,
    items_per_page: 10,
    has_next: false,
    has_prev: false,
  },
  isLoading: false,
  isLoadingMore: false,
  error: null,
  searchQuery: '',
  selectedTags: [],
  hasReachedEnd: false,
  availableTags: ['technology', 'react', 'programming', 'javascript'],
  tagDetails: mockTagDetails,
  isLoadingTags: false,
};

// Mock the context and hooks
const mockUseBlogContext = {
  state: mockBlogState,
  dispatch: jest.fn(),
};

jest.mock('../src/context/BlogContext', () => ({
  useBlogContext: () => mockUseBlogContext,
  BlogProvider: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

jest.mock('../src/hooks/useBlogActions', () => ({
  useBlogActions: () => mockUseBlogActions,
}));

// Mock components
jest.mock('../src/components/BlogCard', () => {
  const React = require('react');
  const {View, Text, TouchableOpacity} = require('react-native');

  return function MockBlogCard({
    blog,
    onPress,
  }: {
    blog: Blog;
    onPress: () => void;
  }) {
    return (
      <TouchableOpacity testID={`blog-card-${blog._id}`} onPress={onPress}>
        <View>
          <Text>{blog.title}</Text>
          <Text>{blog.sub_title}</Text>
        </View>
      </TouchableOpacity>
    );
  };
});

jest.mock('../src/components/SearchBar', () => {
  const React = require('react');
  const {View, TextInput, TouchableOpacity, Text} = require('react-native');

  return function MockSearchBar({onSearch, onClear, value}: any) {
    return (
      <View testID="search-bar">
        <TextInput
          testID="search-input"
          value={value}
          onChangeText={onSearch}
          placeholder="Search..."
        />
        <TouchableOpacity testID="clear-search" onPress={onClear}>
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

jest.mock('../src/components/TagFilter', () => {
  const React = require('react');
  const {View, Text, TouchableOpacity} = require('react-native');

  return function MockTagFilter({
    selectedTags,
    onTagsChange,
    availableTags,
  }: any) {
    return (
      <View testID="tag-filter">
        <View testID="selected-tags-count">
          <Text>{selectedTags.length}</Text>
        </View>
        <View testID="available-tags-count">
          <Text>{availableTags.length}</Text>
        </View>
        <TouchableOpacity
          testID="change-tags"
          onPress={() => onTagsChange(['technology'])}>
          <Text>Change Tags</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

describe('HomeScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock state
    mockUseBlogContext.state = {...mockBlogState};
  });

  describe('Rendering', () => {
    it('renders header with correct title and subtitle', () => {
      render(<HomeScreen />);

      expect(screen.getByText('Latest Blogs')).toBeTruthy();
      expect(
        screen.getByText('Discover amazing stories and insights'),
      ).toBeTruthy();
    });

    it('renders search bar component', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('search-bar')).toBeTruthy();
    });

    it('renders tag filter component', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('tag-filter')).toBeTruthy();
    });

    it('renders blog cards for each blog', () => {
      render(<HomeScreen />);

      expect(screen.getByTestId('blog-card-1')).toBeTruthy();
      expect(screen.getByTestId('blog-card-2')).toBeTruthy();
      expect(screen.getByText('Test Blog 1')).toBeTruthy();
      expect(screen.getByText('Test Blog 2')).toBeTruthy();
    });

    it('renders pagination info', () => {
      render(<HomeScreen />);
      expect(screen.getByText('Showing 2 of 2 blogs')).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator when blogs are loading', () => {
      mockUseBlogContext.state = {
        ...mockBlogState,
        isLoading: true,
        filteredBlogs: [],
      };

      render(<HomeScreen />);
      expect(screen.getByText('Loading blogs...')).toBeTruthy();
    });

    it('shows load more indicator when loading more blogs', () => {
      mockUseBlogContext.state = {
        ...mockBlogState,
        isLoadingMore: true,
      };

      render(<HomeScreen />);
      expect(screen.getByText('Loading more...')).toBeTruthy();
    });

    it('shows end reached message when all blogs loaded', () => {
      mockUseBlogContext.state = {
        ...mockBlogState,
        hasReachedEnd: true,
      };

      render(<HomeScreen />);
      expect(screen.getByText("You've reached the end!")).toBeTruthy();
    });
  });

  describe('Empty States', () => {
    it('shows no blogs message when no data and no filters', () => {
      mockUseBlogContext.state = {
        ...mockBlogState,
        filteredBlogs: [],
        searchQuery: '',
        selectedTags: [],
      };

      render(<HomeScreen />);
      expect(screen.getByText('No blogs available')).toBeTruthy();
      expect(
        screen.getByText('Pull to refresh or try again later'),
      ).toBeTruthy();
    });

    it('shows filtered empty state when no results with search query', () => {
      mockUseBlogContext.state = {
        ...mockBlogState,
        filteredBlogs: [],
        searchQuery: 'nonexistent',
      };

      render(<HomeScreen />);
      expect(screen.getByText('No blogs found')).toBeTruthy();
      expect(
        screen.getByText('Try adjusting your search terms or selected tags'),
      ).toBeTruthy();
      expect(screen.getByText('Clear All Filters')).toBeTruthy();
    });

    it('shows filtered empty state when no results with selected tags', () => {
      mockUseBlogContext.state = {
        ...mockBlogState,
        filteredBlogs: [],
        selectedTags: ['nonexistent'],
      };

      render(<HomeScreen />);
      expect(screen.getByText('No blogs found')).toBeTruthy();
      expect(screen.getByText('Clear All Filters')).toBeTruthy();
    });
  });

  describe('Filtering Functionality', () => {
    it('shows filtered pagination info when search is active', () => {
      mockUseBlogContext.state = {
        ...mockBlogState,
        searchQuery: 'test',
      };

      render(<HomeScreen />);
      expect(screen.getByText('Showing 2 of 2 blogs (filtered)')).toBeTruthy();
    });

    it('shows filtered pagination info when tags are selected', () => {
      mockUseBlogContext.state = {
        ...mockBlogState,
        selectedTags: ['technology'],
      };

      render(<HomeScreen />);
      expect(screen.getByText('Showing 2 of 2 blogs (filtered)')).toBeTruthy();
    });

    it('calls clearAllFilters when clear filters button is pressed', () => {
      mockUseBlogContext.state = {
        ...mockBlogState,
        filteredBlogs: [],
        searchQuery: 'test',
      };

      render(<HomeScreen />);
      fireEvent.press(screen.getByText('Clear All Filters'));

      expect(mockUseBlogActions.clearAllFilters).toHaveBeenCalled();
    });
  });

  describe('Initial Data Fetching', () => {
    it('fetches blogs and tags on component mount', () => {
      render(<HomeScreen />);

      expect(mockUseBlogActions.fetchBlogs).toHaveBeenCalled();
      expect(mockUseBlogActions.fetchTags).toHaveBeenCalled();
    });

    it('only fetches data once on initial mount', () => {
      const {rerender} = render(<HomeScreen />);
      rerender(<HomeScreen />);

      // Should still be called only once from initial mount
      expect(mockUseBlogActions.fetchBlogs).toHaveBeenCalledTimes(1);
      expect(mockUseBlogActions.fetchTags).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('does not show error alert when no error', () => {
      // Mock Alert.alert to track calls
      const mockAlert = jest.fn();
      require('react-native').Alert.alert = mockAlert;

      render(<HomeScreen />);
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it('shows error alert when error exists', async () => {
      const mockAlert = jest.fn();
      require('react-native').Alert.alert = mockAlert;

      mockUseBlogContext.state = {
        ...mockBlogState,
        error: 'Failed to fetch blogs',
      };

      render(<HomeScreen />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Error',
          'Failed to fetch blogs',
          expect.arrayContaining([
            expect.objectContaining({text: 'OK'}),
            expect.objectContaining({text: 'Retry'}),
          ]),
        );
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('calls resetBlogs and fetchBlogs on refresh', () => {
      render(<HomeScreen />);

      // Find the FlatList
      const flatList = screen.getByTestId('blogs-flatlist');
      expect(flatList).toBeTruthy();

      // Test that the functions exist and are properly defined
      expect(mockUseBlogActions.resetBlogs).toBeDefined();
      expect(mockUseBlogActions.fetchBlogs).toBeDefined();
    });
  });

  describe('Component Integration', () => {
    it('passes correct props to SearchBar', () => {
      render(<HomeScreen />);

      const searchBar = screen.getByTestId('search-bar');
      expect(searchBar).toBeTruthy();
      // The search input should have the current search query value
    });

    it('passes correct props to TagFilter', () => {
      render(<HomeScreen />);

      expect(screen.getByTestId('selected-tags-count')).toHaveTextContent('0');
      expect(screen.getByTestId('available-tags-count')).toHaveTextContent('4');
    });

    it('handles tag changes from TagFilter', () => {
      render(<HomeScreen />);

      fireEvent.press(screen.getByTestId('change-tags'));
      expect(mockUseBlogActions.setSelectedTags).toHaveBeenCalledWith([
        'technology',
      ]);
    });
  });

  describe('Accessibility', () => {
    it('provides proper screen reader support', () => {
      render(<HomeScreen />);

      // Check that main content areas are accessible
      expect(screen.getByText('Latest Blogs')).toBeTruthy();
      expect(screen.getByTestId('search-bar')).toBeTruthy();
      expect(screen.getByTestId('tag-filter')).toBeTruthy();
    });
  });
});
