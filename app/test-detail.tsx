import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTestById, submitTest } from '@/services/testService';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function TestDetailScreen() {
  const { id } = useLocalSearchParams();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [current, setCurrent] = useState(0); // current question index
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchTest = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTestById(id as string);
        setTest(data);
        setAnswers(new Array(data.questions.length).fill(-1));
      } catch (err) {
        setError('Không thể tải thông tin bài test.');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handleSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (answers[current] === -1) {
      Alert.alert('Thông báo', 'Bạn cần chọn đáp án trước khi tiếp tục.');
      return;
    }
    if (current < test.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Submit
      setSubmitting(true);
      try {
        // Gửi answers dạng [{ questionId, answer }]
        const formattedAnswers = test.questions.map((q: any, idx: number) => ({
          questionId: q._id,
          answer: answers[idx]
        }));
        const res = await submitTest(id as string, formattedAnswers);
        setResult(res);
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể nộp bài test.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (!test) return null;

  if (result) {
    // const score = result.score || {};
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Kết quả bài test</Text>
        <Text style={styles.resultType}>{result.result}</Text>
        <Text style={styles.resultDescription}>{result.description}</Text>
        {/* Đã ẩn phần điểm chi tiết */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = test.questions[current];
  const total = test.questions.length;

  return (
    <View style={styles.screen}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBar, {width: `${((current+1)/total)*100}%`}]} />
        </View>
        <Text style={styles.progressText}>{current+1}/{total}</Text>
      </View>
      {/* Question card */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>
      {/* Options */}
      <View style={styles.optionsWrap}>
        {q.options.map((opt: string, optIdx: number) => {
          const selected = answers[current] === optIdx;
          return (
            <TouchableOpacity
              key={optIdx}
              style={[styles.optionBtn, selected && styles.optionBtnSelected]}
              onPress={() => handleSelect(optIdx)}
              disabled={submitting}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{opt}</Text>
              {selected && (
                <View style={styles.iconCircle}>
                  <Text style={{color: '#fff', fontSize: 16}}>&#10003;</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Next button */}
      <TouchableOpacity
        style={[styles.nextBtn, submitting && styles.nextBtnDisabled]}
        onPress={handleNext}
        disabled={submitting}
      >
        <Text style={styles.nextBtnText}>{current === total-1 ? (submitting ? 'Đang nộp...' : 'Nộp bài test') : 'Tiếp theo'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    margin: 20,
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 60, // giảm khoảng cách trên
    marginBottom: 50, // giảm khoảng cách dưới topBar
  },
  backIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  progressBarWrap: {
    flex: 1,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontSize: 14,
    minWidth: 36,
    textAlign: 'right',
    marginLeft: 2,
  },
  questionCard: {
    backgroundColor: '#fff', // đổi sang màu trắng
    marginHorizontal: 18,
    borderRadius: 16,
    paddingVertical: 32, // giảm padding dọc
    paddingHorizontal: 10,
    marginBottom: 40, // vừa phải
    width: '94%',
    // height: '20%', // bỏ height cố định
    minHeight: 80, // đảm bảo không quá nhỏ
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    flexWrap: 'wrap', // cho phép xuống dòng
    width: '100%',
  },
  optionsWrap: {
    marginHorizontal: 18,
    marginBottom: 40, // tăng khoảng cách dưới đáp án
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#B0B8FF', // border xanh nhạt hơn
    borderRadius: 12,
    paddingVertical: 18, // tăng padding đáp án
    paddingHorizontal: 18,
    marginBottom: 18, // tăng khoảng cách giữa các đáp án
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  optionBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#E6EDFF', // nền xanh nhạt nổi bật hơn
  },
  optionText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    marginHorizontal: 18,
    borderRadius: 12,
    paddingVertical: 18, // tăng padding nút
    alignItems: 'center',
    marginBottom: 40, // tăng khoảng cách dưới nút
  },
  nextBtnDisabled: {
    opacity: 0.7,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  resultType: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 12,
  },
  resultDescription: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  scoreGrid: {
    width: '100%',
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scoreBox: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  scoreLabel: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 2,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});