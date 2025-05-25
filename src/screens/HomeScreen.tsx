import React, {useEffect} from 'react';
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
} from 'react-native';
import {useBlogContext} from '../context/BlogContext';
import {useBlogActions} from '../hooks/useBlogActions';
import BlogCard from '../components/BlogCard';
import {Blog} from '../types';

const HomeScreen: React.FC = () => {
  const {state} = useBlogContext();
  const {fetchBlogs, clearError} = useBlogActions();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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

  const handleRefresh = () => {
    fetchBlogs();
  };

  const handleBlogPress = (blog: Blog) => {
    // TODO: Navigate to blog detail screen
    console.log('Blog pressed:', blog.title);
  };

  const renderBlogItem = ({item}: {item: Blog}) => (
    <BlogCard blog={item} onPress={() => handleBlogPress(item)} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Latest Blogs</Text>
      <Text style={styles.headerSubtitle}>
        Discover amazing stories and insights
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No blogs available</Text>
      <Text style={styles.emptySubtext}>
        Pull to refresh or try again later
      </Text>
    </View>
  );

  if (state.isLoading && state.blogs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {renderHeader()}
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
      <FlatList
        data={state.blogs}
        renderItem={renderBlogItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={state.isLoading}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />

      {state.pagination && (
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Showing {state.blogs.length} of {state.pagination.total_items} blogs
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
});

export default HomeScreen;
