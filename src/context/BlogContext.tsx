import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {Blog, Pagination} from '../types';

// State interface
interface BlogState {
  allBlogs: Blog[]; // All fetched blogs
  filteredBlogs: Blog[]; // Filtered blogs based on search
  pagination: Pagination | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  searchQuery: string;
  selectedTags: string[]; // Tags selected for filtering
  hasReachedEnd: boolean;
}

// Action types
type BlogAction =
  | {type: 'FETCH_BLOGS_START'}
  | {type: 'FETCH_MORE_BLOGS_START'}
  | {
      type: 'FETCH_BLOGS_SUCCESS';
      payload: {blogs: Blog[]; pagination: Pagination; isLoadMore?: boolean};
    }
  | {type: 'FETCH_BLOGS_ERROR'; payload: string}
  | {type: 'CLEAR_ERROR'}
  | {type: 'SET_SEARCH_QUERY'; payload: string}
  | {type: 'SET_SELECTED_TAGS'; payload: string[]}
  | {type: 'FILTER_BLOGS'}
  | {type: 'RESET_BLOGS'};

// Initial state
const initialState: BlogState = {
  allBlogs: [],
  filteredBlogs: [],
  pagination: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  searchQuery: '',
  selectedTags: [],
  hasReachedEnd: false,
};

// Reducer
const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case 'FETCH_BLOGS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        hasReachedEnd: false,
      };
    case 'FETCH_MORE_BLOGS_START':
      return {
        ...state,
        isLoadingMore: true,
        error: null,
      };
    case 'FETCH_BLOGS_SUCCESS': {
      const {blogs, pagination, isLoadMore = false} = action.payload;
      const updatedAllBlogs = isLoadMore
        ? [...state.allBlogs, ...blogs]
        : blogs;

      // When using server-side tag filtering, we only apply search filter on frontend
      // The API already filtered by tags
      const filteredBlogs = state.searchQuery
        ? updatedAllBlogs.filter(
            blog =>
              blog.title
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase()) ||
              blog.sub_title
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase()) ||
              blog.content
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase()),
          )
        : updatedAllBlogs;

      return {
        ...state,
        isLoading: false,
        isLoadingMore: false,
        allBlogs: updatedAllBlogs,
        filteredBlogs,
        pagination,
        error: null,
        hasReachedEnd: !pagination.has_next,
      };
    }
    case 'FETCH_BLOGS_ERROR':
      return {
        ...state,
        isLoading: false,
        isLoadingMore: false,
        error: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_SELECTED_TAGS':
      return {
        ...state,
        selectedTags: action.payload,
      };
    case 'FILTER_BLOGS': {
      // Only apply search query filter on frontend
      // Tag filtering is handled server-side
      const filteredBlogs = state.searchQuery
        ? state.allBlogs.filter(
            blog =>
              blog.title
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase()) ||
              blog.sub_title
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase()) ||
              blog.content
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase()),
          )
        : state.allBlogs;

      return {
        ...state,
        filteredBlogs,
      };
    }
    case 'RESET_BLOGS':
      return {
        ...state,
        allBlogs: [],
        filteredBlogs: [],
        pagination: null,
        selectedTags: [],
        hasReachedEnd: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context interface
interface BlogContextType {
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
}

// Create context
const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Provider component
interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  return (
    <BlogContext.Provider value={{state, dispatch}}>
      {children}
    </BlogContext.Provider>
  );
};

// Custom hook to use the context
export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};
