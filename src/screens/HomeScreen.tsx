import React, {useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useBlogContext} from '../context/BlogContext';
import {useBlogActions} from '../hooks/useBlogActions';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import TagFilter from '../components/TagFilter';
import {Blog} from '../types';

const HomeScreen: React.FC = () => {
  const {state} = useBlogContext();
  const {
    fetchBlogs,
    fetchTags,
    clearError,
    setSearchQuery,
    clearSearch,
    setSelectedTags,
    clearAllFilters,
    resetBlogs,
  } = useBlogActions();

  const initialFetchRef = useRef(false);

  // Only fetch blogs on initial mount, not when tags change
  useEffect(() => {
    // Only fetch if we haven't done the initial fetch yet
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchBlogs();
      fetchTags(); // Fetch tags on initial mount
    }
  }, [fetchBlogs, fetchTags]);

  useEffect(() => {
    if (state.error) {
      Alert.alert('Error', state.error, [
        {
          text: 'OK',
          onPress: clearError,
        },
        {
          text: 'Retry',
          onPress: () => {
            clearError();
            fetchBlogs();
          },
        },
      ]);
    }
  }, [state.error, clearError, fetchBlogs]);

  const handleRefresh = useCallback(() => {
    resetBlogs();
    fetchBlogs(1, 10, false);
  }, [resetBlogs, fetchBlogs]);

  const handleLoadMore = useCallback(() => {
    if (
      !state.isLoadingMore &&
      !state.hasReachedEnd &&
      state.pagination &&
      state.pagination.has_next &&
      !state.searchQuery // Only prevent load more during search, not tag filtering
    ) {
      const nextPage = state.pagination.current_page + 1;
      fetchBlogs(nextPage, 10, true);
    }
  }, [
    state.isLoadingMore,
    state.hasReachedEnd,
    state.pagination,
    state.searchQuery,
    fetchBlogs,
  ]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery],
  );

  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      setSelectedTags(tags); // This already handles fetching in useBlogActions
    },
    [setSelectedTags],
  );

  const handleClearAllFilters = useCallback(() => {
    clearAllFilters(); // This now handles the API call internally
  }, [clearAllFilters]);

  const handleBlogPress = (blog: Blog) => {
    // TODO: Navigate to blog detail screen
    console.log('Blog pressed:', blog.title);
  };

  const renderBlogItem = ({item}: {item: Blog}) => (
    <BlogCard
      blog={item}
      onPress={() => handleBlogPress(item)}
      searchQuery={state.searchQuery}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Latest Blogs</Text>
      <Text style={styles.headerSubtitle}>
        Discover amazing stories and insights
      </Text>
    </View>
  );

  const renderEmpty = () => {
    if (state.searchQuery || state.selectedTags.length > 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No blogs found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search terms or selected tags
          </Text>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={handleClearAllFilters}>
            <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No blogs available</Text>
        <Text style={styles.emptySubtext}>
          Pull to refresh or try again later
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (state.isLoadingMore) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.footerText}>Loading more...</Text>
        </View>
      );
    }
    if (state.hasReachedEnd && state.filteredBlogs.length > 0) {
      return (
        <View style={styles.footerEnd}>
          <Text style={styles.footerText}>You've reached the end!</Text>
        </View>
      );
    }
    return null;
  };

  if (state.isLoading && state.filteredBlogs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {renderHeader()}
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          value={state.searchQuery}
        />
        <TagFilter
          selectedTags={state.selectedTags}
          onTagsChange={handleTagsChange}
          availableTags={state.availableTags}
          tagDetails={state.tagDetails}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading blogs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClearSearch}
        value={state.searchQuery}
      />
      <TagFilter
        selectedTags={state.selectedTags}
        onTagsChange={handleTagsChange}
        availableTags={state.availableTags}
        tagDetails={state.tagDetails}
      />
      <FlatList
        data={state.filteredBlogs}
        renderItem={renderBlogItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={state.isLoading}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />

      {state.pagination && (
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Showing {state.filteredBlogs.length} of{' '}
            {state.pagination.total_items} blogs
            {(state.searchQuery || state.selectedTags.length > 0) &&
              ' (filtered)'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  clearFiltersButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  paginationInfo: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 14,
    color: '#666',
  },
  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footerEnd: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
