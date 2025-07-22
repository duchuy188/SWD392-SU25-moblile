import React, { useEffect, useState, type ReactElement } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { FileText, User, Briefcase } from 'lucide-react-native';
import { getMyTestResults } from '@/services/testService';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const TEST_TYPE_ICON: Record<string, ReactElement> = {
  PERSONALITY: <User color="#fff" size={28} />,
  CAREER: <Briefcase color="#fff" size={28} />,
};

const TEST_TYPE_GRADIENT = {
  PERSONALITY: ['#7F7FD5', '#86A8E7', '#91EAE4'],
  CAREER: ['#f7971e', '#ffd200', '#f7971e'],
  DEFAULT: ['#43cea2', '#185a9d'],
};

export default function TestHistoryScreen() {
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PERSONALITY' | 'CAREER'>('ALL');
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getMyTestResults();
        // Sort by date descending
        const sorted = (Array.isArray(data) ? data : data.data || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTestHistory(sorted);
      } catch (e) {
        setTestHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Filtered list
  const filteredTests = filter === 'ALL' ? testHistory : testHistory.filter(t => t.testType === filter);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F7FB' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{paddingTop: 32, paddingBottom: 80}}>
        <Text style={{fontWeight: 'bold', fontSize: 26, color: theme.colors.primary, textAlign: 'center', letterSpacing: 1, marginBottom: 10}}>LỊCH SỬ BÀI TEST</Text>
        {/* Filter buttons */}
        <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 18}}>
          {['ALL', 'PERSONALITY', 'CAREER'].map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilter(type as 'ALL' | 'PERSONALITY' | 'CAREER')}
              style={{
                backgroundColor: filter === type ? theme.colors.primary : '#fff',
                borderColor: theme.colors.primary,
                borderWidth: 1.5,
                borderRadius: 18,
                paddingHorizontal: 18,
                paddingVertical: 8,
                marginHorizontal: 6,
                elevation: filter === type ? 4 : 0,
              }}
            >
              <Text style={{color: filter === type ? '#fff' : theme.colors.primary, fontWeight: 'bold', fontSize: 15}}>
                {type === 'ALL' ? 'Tất cả' : (type === 'PERSONALITY' ? 'Tính cách' : 'Nghề nghiệp')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {loading ? (
          <Card style={{ margin: 32, padding: 32, borderRadius: 16, backgroundColor: '#fff', elevation: 2 }}>
            <Text style={{textAlign: 'center'}}>Đang tải...</Text>
          </Card>
        ) : (
          filteredTests.length === 0 ? (
            <Card style={{ margin: 32, padding: 32, borderRadius: 16, backgroundColor: '#fff', elevation: 2 }}>
              <Text style={{textAlign: 'center'}}>Không có lịch sử test.</Text>
            </Card>
          ) : (
            filteredTests.map((item, idx) => {
              const typeKey = String(item.testType) as keyof typeof TEST_TYPE_GRADIENT;
              const gradientColors = TEST_TYPE_GRADIENT[typeKey] || TEST_TYPE_GRADIENT.DEFAULT;
              const icon = TEST_TYPE_ICON[typeKey] || <FileText color="#fff" size={28} />;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.85}
                  style={{marginHorizontal: 18, marginBottom: 22, borderRadius: 22, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 10}}
                  onPress={() => router.push(`/(auth)/detail-test?id=${item._id}`)}
                >
                  <LinearGradient
                    colors={gradientColors as [string, string, string]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{borderRadius: 22, padding: 1}}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 22, padding: 18}}>
                      <View style={{width: 48, height: 48, borderRadius: 24, backgroundColor: gradientColors[1], justifyContent: 'center', alignItems: 'center', marginRight: 16, elevation: 2}}>
                        {icon}
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18, color: theme.colors.primary, textTransform: 'uppercase', marginBottom: 2}}>{item.testName}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                          <Text style={{color: '#555', fontWeight: '500', fontSize: 15}}>Loại: {item.testType}</Text>
                          <View style={{backgroundColor: gradientColors[2], borderRadius: 8, marginLeft: 10, paddingHorizontal: 10, paddingVertical: 3, elevation: 2}}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>KQ: {item.result}</Text>
                          </View>
                        </View>
                        <Text style={{color: '#aaa', fontSize: 13}}>Ngày: {item.date ? new Date(item.date).toLocaleString() : ''}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })
          )
        )}
      </ScrollView>
      {/* Floating Back Button fixed at bottom center */}
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.85}
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <View style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 30,
          paddingHorizontal: 40,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
          elevation: 8,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        }}>
          <FileText color={'#fff'} size={22} />
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18, marginLeft: 10}}>Quay lại</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
} 