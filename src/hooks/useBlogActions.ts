import {useCallback} from 'react';
import {useBlogContext} from '../context/BlogContext';
import {blogService} from '../services/blogService';

export const useBlogActions = () => {
  const {dispatch} = useBlogContext();

  const fetchBlogs = useCallback(
    async (page: number = 1, limit: number = 10) => {
      try {
        dispatch({type: 'FETCH_BLOGS_START'});

        const response = await blogService.getBlogs(page, limit);

        if (response.success) {
          dispatch({
            type: 'FETCH_BLOGS_SUCCESS',
            payload: {
              blogs: response.data.data,
              pagination: response.data.pagination,
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

  const clearError = useCallback(() => {
    dispatch({type: 'CLEAR_ERROR'});
  }, [dispatch]);

  return {
    fetchBlogs,
    clearError,
  };
};
