import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { careerPathsData } from '@/data/careerPathsData';

export default function CareerScreen() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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
        <Text style={styles.pageTitle}>Lộ trình hướng nghiệp</Text>
        <Text style={styles.pageSubtitle}>
          Khám phá nghề nghiệp phù hợp dựa trên tính cách và sở thích của bạn
        </Text>
      </View>

      <View style={styles.introContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/6147160/pexels-photo-6147160.jpeg' }}
          style={styles.introImage}
        />
        <View style={styles.introTextContainer}>
          <Text style={styles.introText}>
            Mỗi người có một tính cách và sở thích riêng, từ đó dẫn đến những lựa chọn nghề nghiệp phù hợp khác nhau. 
            Hãy khám phá các nhóm tính cách dưới đây để tìm ra hướng đi phù hợp nhất với bạn.
          </Text>
        </View>
      </View>

      <View style={styles.careerPathsContainer}>
        {careerPathsData.map((path) => (
          <View key={path.id} style={styles.careerPathCard}>
            <TouchableOpacity 
              style={styles.careerPathHeader}
              onPress={() => toggleExpand(path.id)}
            >
              <View style={styles.careerPathTitleContainer}>
                <View style={[styles.careerPathIcon, { backgroundColor: path.color }]}>
                  <Text style={styles.careerPathIconText}>{path.icon}</Text>
                </View>
                <View>
                  <Text style={styles.careerPathTitle}>{path.title}</Text>
                  <Text style={styles.careerPathSubtitle}>{path.subtitle}</Text>
                </View>
              </View>
              <ChevronRight 
                size={20} 
                color={Colors.text} 
                style={{ 
                  transform: [{ rotate: expandedItem === path.id ? '90deg' : '0deg' }],
                }}
              />
            </TouchableOpacity>
            
            {expandedItem === path.id && (
              <View style={styles.careerPathContent}>
                <Text style={styles.careerPathDescription}>{path.description}</Text>
                
                <Text style={styles.suitableCareersTitle}>Ngành nghề phù hợp:</Text>
                <View style={styles.suitableCareersContainer}>
                  {path.careers.map((career, index) => (
                    <View key={index} style={styles.careerItem}>
                      <Text style={styles.careerItemText}>{career}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.learnMoreButton}>
                  <Text style={styles.learnMoreButtonText}>Khám phá chi tiết</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
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