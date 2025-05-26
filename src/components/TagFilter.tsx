import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  onTagsChange,
  availableTags,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempSelectedTags, setTempSelectedTags] =
    useState<string[]>(selectedTags);

  // Initialize temp tags with current selection and keep them in sync
  useEffect(() => {
    setTempSelectedTags([...selectedTags]);
  }, [selectedTags]);

  // Update temp tags when modal opens to ensure they're current
  useEffect(() => {
    if (isModalVisible) {
      setTempSelectedTags([...selectedTags]);
    }
  }, [isModalVisible, selectedTags]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setTempSelectedTags([...selectedTags]); // Reset to original
    setIsModalVisible(false);
  };

  const applyTags = () => {
    onTagsChange(tempSelectedTags);
    setIsModalVisible(false);
  };

  const toggleTempTag = (tag: string) => {
    if (tempSelectedTags.includes(tag)) {
      setTempSelectedTags(tempSelectedTags.filter(t => t !== tag));
    } else {
      setTempSelectedTags([...tempSelectedTags, tag]);
    }
  };

  const clearAllTempTags = () => {
    setTempSelectedTags([]);
  };

  const renderTag = ({item}: {item: string}) => {
    const isSelected = tempSelectedTags.includes(item);
    return (
      <TouchableOpacity
        style={[styles.tagItem, isSelected && styles.selectedTagItem]}
        onPress={() => toggleTempTag(item)}
        activeOpacity={0.7}>
        <View style={styles.tagContent}>
          <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>
            {item}
          </Text>
          {isSelected && (
            <View style={styles.checkmarkContainer}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Show a message if no tags available
  if (!availableTags || availableTags.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.noTagsText}>No tags available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedTags.length > 0 && styles.activeFilterButton,
          ]}
          onPress={openModal}
          activeOpacity={0.8}>
          <Text
            style={[
              styles.filterButtonText,
              selectedTags.length > 0 && styles.activeFilterButtonText,
            ]}>
            🏷️ Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
          </Text>
        </TouchableOpacity>

        {selectedTags.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onTagsChange([])}
            activeOpacity={0.7}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedTags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectedTagsContainer}
          contentContainerStyle={styles.selectedTagsContent}>
          {selectedTags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={styles.selectedTag}
              onPress={() => {
                // Remove tag directly from selected tags
                onTagsChange(selectedTags.filter(t => t !== tag));
              }}
              activeOpacity={0.8}>
              <Text style={styles.selectedTagLabel}>{tag}</Text>
              <Text style={styles.removeTagText}> ✕</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Tags</Text>
            <TouchableOpacity onPress={applyTags} style={styles.modalButton}>
              <Text style={styles.applyButton}>
                Apply ({tempSelectedTags.length})
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Available Tags ({availableTags.length})
              </Text>
              {tempSelectedTags.length > 0 && (
                <TouchableOpacity onPress={clearAllTempTags}>
                  <Text style={styles.clearAllText}>Clear Selection</Text>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={availableTags}
              renderItem={renderTag}
              keyExtractor={item => item}
              numColumns={2}
              contentContainerStyle={styles.tagsGrid}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.tagRow}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '600',
  },
  noTagsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  selectedTagsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  selectedTagsContent: {
    paddingRight: 16,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedTagLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  removeTagText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  modalButton: {
    minWidth: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearAllText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '600',
  },
  tagsGrid: {
    paddingBottom: 20,
  },
  tagRow: {
    justifyContent: 'space-between',
  },
  tagItem: {
    flex: 0.48,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedTagItem: {
    backgroundColor: '#007AFF',
    borderColor: '#0056b3',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
  },
  tagContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
  selectedTagText: {
    color: '#fff',
    fontWeight: '600',
  },
  checkmarkContainer: {
    marginLeft: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  applyButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '700',
  },
});

export default TagFilter;
