import {useCallback} from 'react';
import {useBlogContext} from '../context/BlogContext';
import {blogService} from '../services/blogService';

export const useBlogActions = () => {
  const {dispatch} = useBlogContext();

  const fetchBlogs = useCallback(
    async (page: number = 1, limit: number = 10, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          dispatch({type: 'FETCH_MORE_BLOGS_START'});
        } else {
          dispatch({type: 'FETCH_BLOGS_START'});
        }

        const response = await blogService.getBlogs(page, limit);

        if (response.success) {
          dispatch({
            type: 'FETCH_BLOGS_SUCCESS',
            payload: {
              blogs: response.data.data,
              pagination: response.data.pagination,
              isLoadMore,
            },
          });
        } else {
          dispatch({
            type: 'FETCH_BLOGS_ERROR',
            payload: response.message || 'Failed to fetch blogs',
          });
        }
      } catch (error) {
        dispatch({
          type: 'FETCH_BLOGS_ERROR',
          payload:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        });
      }
    },
    [dispatch],
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      dispatch({type: 'SET_SEARCH_QUERY', payload: query});
      dispatch({type: 'FILTER_BLOGS'});
    },
    [dispatch],
  );

  const clearSearch = useCallback(() => {
    dispatch({type: 'SET_SEARCH_QUERY', payload: ''});
    dispatch({type: 'FILTER_BLOGS'});
  }, [dispatch]);

  const resetBlogs = useCallback(() => {
    dispatch({type: 'RESET_BLOGS'});
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch({type: 'CLEAR_ERROR'});
  }, [dispatch]);

  return {
    fetchBlogs,
    setSearchQuery,
    clearSearch,
    resetBlogs,
    clearError,
  };
};
