import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Blog} from '../types';

interface BlogCardProps {
  blog: Blog;
  onPress?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({blog, onPress}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.card}>
        {blog.author.profile_pic_url && (
          <Image
            source={{uri: blog.author.profile_pic_url}}
            style={styles.authorImage}
          />
        )}

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {blog.title}
          </Text>

          <Text style={styles.subtitle} numberOfLines={1}>
            {blog.sub_title}
          </Text>

          <Text style={styles.description} numberOfLines={3}>
            {truncateContent(blog.content)}
          </Text>

          <View style={styles.tagsContainer}>
            {blog.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>By {blog.author.name}</Text>
              <Text style={styles.date}>{formatDate(blog.createdAt)}</Text>
            </View>

            <View style={styles.stats}>
              <Text style={styles.views}>{blog.views} views</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  authorImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  stats: {
    alignItems: 'flex-end',
  },
  views: {
    fontSize: 12,
    color: '#888',
  },
});

export default BlogCard;
