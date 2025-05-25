import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {Blog, Pagination} from '../types';

// State interface
interface BlogState {
  blogs: Blog[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

// Action types
type BlogAction =
  | {type: 'FETCH_BLOGS_START'}
  | {
      type: 'FETCH_BLOGS_SUCCESS';
      payload: {blogs: Blog[]; pagination: Pagination};
    }
  | {type: 'FETCH_BLOGS_ERROR'; payload: string}
  | {type: 'CLEAR_ERROR'};

// Initial state
const initialState: BlogState = {
  blogs: [],
  pagination: null,
  isLoading: false,
  error: null,
};

// Reducer
const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case 'FETCH_BLOGS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_BLOGS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        blogs: action.payload.blogs,
        pagination: action.payload.pagination,
        error: null,
      };
    case 'FETCH_BLOGS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
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
