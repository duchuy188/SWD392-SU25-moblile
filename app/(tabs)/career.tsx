import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { getTests } from '@/services/testService';
import { useRouter } from 'expo-router';

export default function TestScreen() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getTests();
        setTests(data);
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const toggleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Các bài test tâm lý</Text>
        <Text style={styles.pageSubtitle}>
          Khám phá các bài test tâm lý để hiểu rõ hơn về bản thân bạn
        </Text>
      </View>

      <View style={styles.introContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/6147160/pexels-photo-6147160.jpeg' }}
          style={styles.introImage}
        />
        <View style={styles.introTextContainer}>
          <Text style={styles.introText}>
            Thực hiện các bài test tâm lý để khám phá tính cách, sở thích và định hướng nghề nghiệp phù hợp với bạn.
          </Text>
        </View>
      </View>

      <View style={styles.careerPathsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          tests.map((test) => (
            <View key={test._id} style={styles.careerPathCard}>
              <TouchableOpacity 
                style={styles.careerPathHeader}
                onPress={() => toggleExpand(test._id)}
              >
                <View style={styles.careerPathTitleContainer}>
                  <View style={[styles.careerPathIcon, { backgroundColor: Colors.secondary }]}> {/* You can randomize or map color/icon if needed */}
                    <Text style={styles.careerPathIconText}>📝</Text>
                  </View>
                  <View>
                    <Text style={styles.careerPathTitle}>{test.name}</Text>
                    <Text style={styles.careerPathSubtitle}>{test.type}</Text>
                  </View>
                </View>
                <ChevronRight 
                  size={20} 
                  color={Colors.text} 
                  style={{ 
                    transform: [{ rotate: expandedItem === test._id ? '90deg' : '0deg' }],
                  }}
                />
              </TouchableOpacity>
              {expandedItem === test._id && (
                <View style={styles.careerPathContent}>
                  <Text style={styles.careerPathDescription}>{test.description}</Text>
                  <TouchableOpacity style={styles.learnMoreButton} onPress={() => router.push({ pathname: '/test-detail', params: { id: test._id } })}>
                    <Text style={styles.learnMoreButtonText}>Làm bài test</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
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
  introContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  introImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  introTextContainer: {
    padding: 16,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  careerPathsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  careerPathCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  careerPathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  careerPathTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  careerPathIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  careerPathIconText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  careerPathTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  careerPathSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  careerPathContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  careerPathDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
    marginBottom: 16,
  },
  suitableCareersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  suitableCareersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  careerItem: {
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  careerItemText: {
    fontSize: 14,
    color: Colors.text,
  },
  learnMoreButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  learnMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});