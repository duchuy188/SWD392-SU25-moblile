import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { MajorCard } from '@/components/MajorCard';
import { getMajors } from '@/services/majorService';
import { useRouter } from 'expo-router';

export default function MajorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([{ id: 'all', name: 'Tất cả' }]);
  const router = useRouter();

  useEffect(() => {
    const fetchMajors = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          search: searchQuery || undefined,
        };
        const data = await getMajors(params);
        let majorsList = data.majors || data || [];
        
        const departmentSet = new Set<string>();
        majorsList.forEach((major: any) => {
          if (major.department) departmentSet.add(major.department);
        });
        const dynamicCategories = [
          { id: 'all', name: 'Tất cả' },
          ...Array.from(departmentSet).map(dep => ({ id: dep, name: dep }))
        ];
        setCategories(dynamicCategories);
        
        if (selectedCategory !== 'all') {
          majorsList = majorsList.filter((major: any) => major.department === selectedCategory);
        }
        setMajors(majorsList);
      } catch (err) {
        setError('Không thể tải danh sách ngành học.');
      } finally {
        setLoading(false);
      }
    };
    fetchMajors();
  }, [searchQuery, selectedCategory]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Khám phá ngành học</Text>
        <Text style={styles.pageSubtitle}>
          Tìm hiểu chi tiết về các ngành học phổ biến tại Việt Nam
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.text} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm ngành học..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Majors list */}
      <View style={styles.majorsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 32 }} />
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{error}</Text>
          </View>
        ) : majors.length > 0 ? (
          majors.map((major: any) => (
            <TouchableOpacity
              key={major._id || major.id}
              onPress={() => router.push({ pathname: '/major-detail', params: { id: major._id || major.id } })}
            >
              <MajorCard 
                name={major.name || major.title}
                description={major.description}
                code={major.code}
                department={major.department}
                imageUrl={major.imageUrl}
                shortDescription={major.shortDescription}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Không tìm thấy ngành học phù hợp. Vui lòng thử tìm kiếm khác.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginLeft: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  majorsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
});