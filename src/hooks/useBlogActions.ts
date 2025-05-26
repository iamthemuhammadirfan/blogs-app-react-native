import {useCallback} from 'react';
import {useBlogContext} from '../context/BlogContext';
import {blogService} from '../services/blogService';

export const useBlogActions = () => {
  const {dispatch, state} = useBlogContext();

  const fetchBlogs = useCallback(
    async (page: number = 1, limit: number = 10, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          dispatch({type: 'FETCH_MORE_BLOGS_START'});
        } else {
          dispatch({type: 'FETCH_BLOGS_START'});
        }

        // Use selected tags when fetching
        const response = await blogService.getBlogs(
          page,
          limit,
          state.selectedTags,
        );

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
    [dispatch, state.selectedTags],
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

  const setSelectedTags = useCallback(
    async (tags: string[]) => {
      dispatch({type: 'SET_SELECTED_TAGS', payload: tags});
      // Reset blogs and fetch with new tags
      dispatch({type: 'RESET_BLOGS'});

      // Auto-fetch with new tags
      try {
        dispatch({type: 'FETCH_BLOGS_START'});
        const response = await blogService.getBlogs(1, 10, tags);

        if (response.success) {
          dispatch({
            type: 'FETCH_BLOGS_SUCCESS',
            payload: {
              blogs: response.data.data,
              pagination: response.data.pagination,
              isLoadMore: false,
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

  const clearAllFilters = useCallback(async () => {
    dispatch({type: 'SET_SEARCH_QUERY', payload: ''});
    dispatch({type: 'SET_SELECTED_TAGS', payload: []});
    dispatch({type: 'RESET_BLOGS'});

    // Fetch all blogs without filters
    try {
      dispatch({type: 'FETCH_BLOGS_START'});
      const response = await blogService.getBlogs(1, 10, []);

      if (response.success) {
        dispatch({
          type: 'FETCH_BLOGS_SUCCESS',
          payload: {
            blogs: response.data.data,
            pagination: response.data.pagination,
            isLoadMore: false,
          },
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
  }, [dispatch]);

  const fetchTags = useCallback(async () => {
    try {
      dispatch({type: 'FETCH_TAGS_START'});
      const response = await blogService.getTags();

      if (response.success) {
        dispatch({
          type: 'FETCH_TAGS_SUCCESS',
          payload: {
            tags: response.data.tags,
            tagDetails: response.data.tagDetails,
          },
        });
      } else {
        dispatch({
          type: 'FETCH_TAGS_ERROR',
          payload: response.message || 'Failed to fetch tags',
        });
      }
    } catch (error) {
      dispatch({
        type: 'FETCH_TAGS_ERROR',
        payload:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    }
  }, [dispatch]);

  return {
    fetchBlogs,
    fetchTags,
    setSearchQuery,
    clearSearch,
    setSelectedTags,
    clearAllFilters,
    resetBlogs,
    clearError,
  };
};
