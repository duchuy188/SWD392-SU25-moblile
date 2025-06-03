import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { FeaturedCard } from '@/components/FeaturedCard';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg' }} 
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>EduBot</Text>
          <Text style={styles.heroSubtitle}>Tư vấn học tập & hướng nghiệp thông minh</Text>
          <Link href="/chatbot" asChild>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Bắt đầu tư vấn</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Tính năng chính</Text>
        <View style={styles.featuresContainer}>
          <FeaturedCard 
            title="Khám phá ngành học"
            description="Tìm hiểu thông tin chi tiết về các ngành học phổ biến tại Việt Nam"
            icon="graduation-cap"
            route="/majors"
          />
          <FeaturedCard 
            title="Tư vấn hướng nghiệp"
            description="Khám phá nghề nghiệp phù hợp với tính cách và sở thích của bạn"
            icon="briefcase"
            route="/career"
          />
          <FeaturedCard 
            title="Trò chuyện với EduBot"
            description="Đặt câu hỏi và nhận tư vấn cá nhân hóa từ trợ lý AI của chúng tôi"
            icon="message-square"
            route="/chatbot"
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Về EduBot</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>
            EduBot là chatbot AI được thiết kế để hỗ trợ học sinh THPT tại Việt Nam trong quá trình định hướng học tập và nghề nghiệp.
            Với cơ sở dữ liệu phong phú về các ngành học và xu hướng nghề nghiệp hiện đại,
            EduBot cung cấp thông tin chính xác và phù hợp với nhu cầu của từng học sinh.
          </Text>
          <Link href="/contact" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Tìm hiểu thêm</Text>
              <ChevronRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroContainer: {
    position: 'relative',
    height: 360,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 29, 149, 0.7)',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
    maxWidth: '80%',
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 16,
  },
  aboutContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
    marginRight: 4,
  },
});

