import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';

interface LoadingIndicatorProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  text = 'Loading...',
  size = 'large',
  color = '#007AFF',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoadingIndicator;
