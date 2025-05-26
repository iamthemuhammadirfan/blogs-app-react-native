import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = 'Search blogs...',
  value,
}) => {
  const [localQuery, setLocalQuery] = useState(value || '');

  const handleSearch = () => {
    onSearch(localQuery.trim());
  };

  const handleClear = () => {
    setLocalQuery('');
    onClear();
  };

  const handleChangeText = (text: string) => {
    setLocalQuery(text);
    // Real-time search as user types
    if (text.trim() === '') {
      onClear();
    } else {
      onSearch(text.trim());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={localQuery}
          onChangeText={handleChangeText}
          placeholderTextColor="#999"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {(localQuery?.length || 0) > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});

export default SearchBar;
