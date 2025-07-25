import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { getTestResultById } from '@/services/testService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Wrench, Search, Palette, Users, Briefcase, FileText, User, Eye, Star, Brain, Heart, Check, HelpCircle } from 'lucide-react-native';

const SCORE_LABELS: Record<string, string> = {
  Realistic: 'Thực tế',
  Investigative: 'Nghiên cứu',
  Artistic: 'Nghệ thuật',
  Social: 'Xã hội',
  Enterprising: 'Quản lý',
  Conventional: 'Quy ước',
  e: 'E', i: 'I', s: 'S', n: 'N', t: 'T', f: 'F', j: 'J', p: 'P',
};

const SCORE_ICONS: Record<string, React.ReactNode> = {
  Realistic: <Wrench color="#F9A825" size={28} />,
  Investigative: <Search color="#F9A825" size={28} />,
  Artistic: <Palette color="#F9A825" size={28} />,
  Social: <Users color="#F9A825" size={28} />,
  Enterprising: <Briefcase color="#F9A825" size={28} />,
  Conventional: <FileText color="#F9A825" size={28} />,
};

const MBTI_LABELS: Record<string, string> = {
  e: 'Hướng ngoại',
  i: 'Hướng nội',
  s: 'Cảm nhận',
  n: 'Trực giác',
  t: 'Lý trí',
  f: 'Cảm xúc',
  j: 'Nguyên tắc',
  p: 'Linh hoạt',
  E: 'Hướng ngoại',
  I: 'Hướng nội',
  S: 'Cảm nhận',
  N: 'Trực giác',
  T: 'Lý trí',
  F: 'Cảm xúc',
  J: 'Nguyên tắc',
  P: 'Linh hoạt',
};
const MBTI_ICONS: Record<string, React.ReactNode> = {
  e: <Users color="#1976D2" size={28} />, E: <Users color="#1976D2" size={28} />,
  i: <User color="#1976D2" size={28} />, I: <User color="#1976D2" size={28} />,
  s: <Eye color="#1976D2" size={28} />, S: <Eye color="#1976D2" size={28} />,
  n: <Star color="#1976D2" size={28} />, N: <Star color="#1976D2" size={28} />,
  t: <Brain color="#1976D2" size={28} />, T: <Brain color="#1976D2" size={28} />,
  f: <Heart color="#1976D2" size={28} />, F: <Heart color="#1976D2" size={28} />,
  j: <Check color="#1976D2" size={28} />, J: <Check color="#1976D2" size={28} />,
  p: <HelpCircle color="#1976D2" size={28} />, P: <HelpCircle color="#1976D2" size={28} />,
};

export default function DetailTestScreen() {
  const { id } = useLocalSearchParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTestResultById(id as string)
      .then(setResult)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }
  if (!result) {
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Không tìm thấy kết quả.</Text></View>;
  }

  // Render score grid 2:2:2
  const renderScore = () => {
    if (!result.score) return null;
    const entries = Object.entries(result.score);
    // Đảm bảo luôn 6 ô (3 hàng 2 ô), nếu ít hơn thì thêm ô trống
    const filled = [...entries];
    while (filled.length < 6) filled.push(['', '']);
    const rows = [filled.slice(0,2), filled.slice(2,4), filled.slice(4,6)];
    const isMBTI = result.testType === 'PERSONALITY';
    return (
      <View style={{marginTop: 18}}>
        <Text style={{fontWeight:'bold', fontSize:17, marginBottom:8, color:theme.colors.primary}}>Điểm</Text>
        {rows.map((row, ridx) => (
          <View key={ridx} style={{flexDirection:'row', justifyContent:'center', marginBottom:18}}>
            {row.map(([k, v], idx) => {
              const label = isMBTI ? MBTI_LABELS[k] || k : SCORE_LABELS[k] || k;
              const icon = isMBTI ? MBTI_ICONS[k] : SCORE_ICONS[k];
              return (
                <View key={k+idx} style={{
                  backgroundColor: isMBTI ? '#E3F2FD' : '#FFF7E0',
                  borderRadius:16,
                  width:130,
                  minHeight:110,
                  paddingVertical:14,
                  paddingHorizontal:8,
                  marginHorizontal:12,
                  marginVertical:8,
                  alignItems:'center',
                  justifyContent:'center',
                  elevation:2,
                  shadowColor: isMBTI ? '#1976D2' : '#F9A825',
                  shadowOpacity:0.08,
                  shadowRadius:4
                }}>
                  {icon && <View style={{marginBottom:2}}>{icon}</View>}
                  <Text style={{fontWeight:'bold', fontSize:18, color: isMBTI ? '#1976D2' : theme.colors.primary, marginTop:2}}>{label}</Text>
                  {k ? <Text style={{fontSize:20, fontWeight:'bold', color: isMBTI ? '#1976D2' : '#F9A825', marginTop:4}}>{String(v)}</Text> : null}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  // Render majors
  const renderMajors = (majors: any[], title: string) => {
    if (!majors || majors.length === 0) return null;
    return (
      <View style={{marginTop: 18}}>
        <Text style={{fontWeight:'bold', fontSize:17, marginBottom:8, color:theme.colors.primary}}>{title}</Text>
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          {majors.map((m, idx) => (
            <View key={m.id+idx} style={{backgroundColor:'#E3F2FD', borderRadius:10, padding:10, margin:5, minWidth:120, alignItems:'center', elevation:1}}>
              <Text style={{fontWeight:'bold', color:theme.colors.primary}}>{m.name}</Text>
              <Text style={{color:'#888', fontSize:13}}>{m.code}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{flex:1, backgroundColor:'#F9FAFB'}}>
      {/* Floating back button top left */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{position:'absolute', top:36, left:18, zIndex:10, backgroundColor:theme.colors.primary, borderRadius:20, padding:10, elevation:6, shadowColor:theme.colors.primary, shadowOpacity:0.18, shadowRadius:8}}
      >
        <ArrowLeft color={'#fff'} size={22} />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{alignItems:'center', justifyContent:'center', minHeight:'80%', paddingVertical:36}}
        style={{width:'100%'}}
        showsVerticalScrollIndicator={false}
      >
        <Card style={{borderRadius:28, padding:32, width:'96%', elevation:4, backgroundColor:'#F6F3FF', alignItems:'center', justifyContent:'center', maxWidth:480}}>
          <Text style={{fontWeight:'bold', fontSize:26, color:theme.colors.primary, textAlign:'center', marginBottom:16}}>Kết quả của bạn</Text>
          <View style={{alignItems:'center', marginBottom:16}}>
            <View style={{
              backgroundColor: result.testType === 'PERSONALITY' ? '#E3F2FD' : '#FFE0B2',
              borderRadius:12,
              paddingHorizontal:36,
              paddingVertical:12,
              marginBottom:10,
              elevation:2
            }}>
              <Text style={{
                fontWeight:'bold',
                fontSize:24,
                color: result.testType === 'PERSONALITY' ? '#1976D2' : '#F9A825'
              }}>{result.result}</Text>
            </View>
            <Text style={{color:'#888', fontSize:17}}>{result.date ? new Date(result.date).toLocaleDateString() : ''}</Text>
          </View>
          <Text style={{fontWeight:'bold', fontSize:18, marginTop:18, marginBottom:8, color:theme.colors.primary, alignSelf:'flex-start'}}>Mô tả</Text>
          <Text style={{color:'#444', fontSize:17, marginBottom:18, textAlign:'center', lineHeight:24}}>{result.description}</Text>
          {renderScore()}
          {renderMajors(result.recommendedMajors, 'Ngành đề xuất')}
          {renderMajors(result.recommendedFPTMajors, 'Ngành FPT đề xuất')}
        </Card>
      </ScrollView>
    </View>
  );
} 