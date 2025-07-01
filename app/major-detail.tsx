import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet } from 'react-native';
import { getMajorById } from '@/services/majorService';
import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Major = {
  imageUrl?: string;
  name?: string;
  department?: string;
  code?: string;
  totalCredits?: number;
  tuition?: {
    firstSem?: number;
    midSem?: number;
    lastSem?: number;
  };
  description?: string;
};

export const unstable_settings = {
  headerShown: false,
};

export default function MajorDetailScreen() {
  const { id } = useLocalSearchParams();
  const [major, setMajor] = useState<Major | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchMajor = async () => {
      try {
        const data = await getMajorById(id as string);
        setMajor(data);
      } catch (err) {
        setError('Không thể tải thông tin ngành học.');
      } finally {
        setLoading(false);
      }
    };
    fetchMajor();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 32 }} />;
  if (error) return <Text style={{ color: 'red', margin: 20 }}>{error}</Text>;
  if (!major) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F8FA' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.imageBox}>
          {major.imageUrl && (
            <Image source={{ uri: major.imageUrl }} style={styles.image} />
          )}
          <View style={styles.imageGradient} />
          <View style={styles.imageTitleBox}>
            <Text style={styles.imageTitle}>{major.name}</Text>
          </View>
        </View>
        <View style={styles.infoRowPro}>
          <View style={[styles.infoCardPro, { backgroundColor: '#fff', shadowColor: '#38BDF8' }]}> 
            <Ionicons name="business" size={36} color="#38BDF8" style={styles.infoCardIconPro} />
            <Text style={styles.infoCardLabelPro}>Khoa</Text>
            <Text style={styles.infoCardValuePro}>{major.department}</Text>
          </View>
          <View style={[styles.infoCardPro, { backgroundColor: '#fff', shadowColor: '#8B5CF6' }]}> 
            <Ionicons name="barcode" size={36} color="#8B5CF6" style={styles.infoCardIconPro} />
            <Text style={styles.infoCardLabelPro}>Mã ngành</Text>
            <Text style={styles.infoCardValuePro}>{major.code}</Text>
          </View>
          <View style={[styles.infoCardPro, { backgroundColor: '#fff', shadowColor: '#FACC15' }]}> 
            <Ionicons name="layers" size={36} color="#FACC15" style={styles.infoCardIconPro} />
            <Text style={styles.infoCardLabelPro}>Tín chỉ</Text>
            <Text style={styles.infoCardValuePro}>{major.totalCredits}</Text>
          </View>
        </View>
        <View style={styles.cardTuitionPro}>
          <View style={styles.tuitionHeaderRowPro}>
            <Ionicons name="cash" size={26} color="#3B82F6" style={{ marginRight: 10 }} />
            <Text style={styles.tuitionTitlePro}>Học phí</Text>
          </View>
          <View style={styles.tuitionGridPro}>
            <View style={[styles.tuitionColPro, { backgroundColor: '#F0F9FF', shadowColor: '#38BDF8' }]}> 
              <View style={styles.tuitionColHeaderPro}>
                <Ionicons name="card" size={18} color="#38BDF8" style={{ marginRight: 4 }} />
                <Text style={styles.tuitionLabelPro}>Kỳ 1</Text>
              </View>
              <Text style={styles.tuitionValuePro}>{major.tuition?.firstSem?.toLocaleString()} VND</Text>
            </View>
            <View style={[styles.tuitionColPro, { backgroundColor: '#F5F3FF', shadowColor: '#8B5CF6' }]}> 
              <View style={styles.tuitionColHeaderPro}>
                <Ionicons name="card" size={18} color="#8B5CF6" style={{ marginRight: 4 }} />
                <Text style={styles.tuitionLabelPro}>Kỳ giữa</Text>
              </View>
              <Text style={styles.tuitionValuePro}>{major.tuition?.midSem?.toLocaleString()} VND</Text>
            </View>
            <View style={[styles.tuitionColPro, { backgroundColor: '#FEF9C3', shadowColor: '#FACC15' }]}> 
              <View style={styles.tuitionColHeaderPro}>
                <Ionicons name="card" size={18} color="#FACC15" style={{ marginRight: 4 }} />
                <Text style={styles.tuitionLabelPro}>Kỳ cuối</Text>
              </View>
              <Text style={styles.tuitionValuePro}>{major.tuition?.lastSem?.toLocaleString()} VND</Text>
            </View>
          </View>
        </View>
        <View style={styles.descSection}>
          <View style={styles.descHeaderRow}>
            <Ionicons name="information-circle-outline" size={20} color="#3B82F6" style={{ marginRight: 6 }} />
            <Text style={styles.descTitle}>Giới thiệu ngành</Text>
          </View>
          <View style={styles.descDivider} />
          <Text style={styles.description}>{major.description}</Text>
        </View>
      </ScrollView>
      <View style={styles.fabBackWrap}>
        <Ionicons
          name="arrow-back"
          size={28}
          color="#3B82F6"
          style={styles.fabBack}
          onPress={() => router.replace('/(tabs)/majors')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    position: 'relative',
    width: '100%',
    height: 220,
    marginBottom: -32,
    justifyContent: 'flex-end',
    backgroundColor: '#eee',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  imageTitleBox: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  imageTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoRowPro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 44,
    marginBottom: 18,
  },
  infoCardPro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderRadius: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 7,
    minHeight: 120,
    maxWidth: 120,
  },
  infoCardIconPro: {
    marginBottom: 8,
  },
  infoCardLabelPro: {
    fontSize: 13,
    color: '#A3A3A3',
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: 'System',
    textAlign: 'center',
  },
  infoCardValuePro: {
    fontSize: 16,
    color: '#222',
    fontWeight: '700',
    fontFamily: 'System',
    marginTop: 2,
    textAlign: 'center',
    flexWrap: 'wrap',
    maxWidth: 100,
  },
  cardTuitionPro: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  tuitionHeaderRowPro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  tuitionTitlePro: {
    fontWeight: 'bold',
    color: '#3B82F6',
    fontSize: 18,
    fontFamily: 'System',
  },
  tuitionGridPro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  tuitionColPro: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 8,
    paddingVertical: 18,
    backgroundColor: '#F0F9FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  tuitionColHeaderPro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tuitionLabelPro: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '700',
    fontFamily: 'System',
  },
  tuitionValuePro: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    fontFamily: 'System',
    marginTop: 2,
    textAlign: 'center',
  },
  descSection: {
    marginTop: 22,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  descHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  descTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  descDivider: {
    height: 2,
    width: 36,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    marginBottom: 10,
    marginTop: 2,
  },
  description: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
    textAlign: 'justify',
  },
  fabBackWrap: {
    position: 'absolute',
    top: 32,
    left: 16,
    zIndex: 99,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  fabBack: {
    alignSelf: 'center',
  },
}); 