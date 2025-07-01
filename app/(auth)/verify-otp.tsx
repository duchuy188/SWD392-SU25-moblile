import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authApi } from '@/services/authService';
import Colors from '@/constants/Colors';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOtp = async () => {
    setOtpError('');
    if (!otp.trim()) {
      setOtpError('Vui lòng nhập mã OTP');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(email as string, otp);
      setIsLoading(false);
      const resetToken = response.resetToken;
      Alert.alert('Thành công', 'Xác thực OTP thành công. Vui lòng đặt lại mật khẩu.', [
        {
          text: 'OK',
          onPress: () => router.replace({ pathname: '/(auth)/reset-password', params: { email, resetToken } })
        }
      ]);
    } catch (error: any) {
      setIsLoading(false);
      setOtpError(error?.message || 'Xác thực OTP thất bại');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Nhập mã OTP</Text>
        <Text style={styles.subtitle}>Mã OTP đã được gửi đến email: {email}</Text>
        <TextInput
          style={[styles.input, otpError ? styles.inputError : null]}
          placeholder="Nhập mã OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
        />
        {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center' },
  innerContainer: { padding: 24, backgroundColor: '#fff', margin: 24, borderRadius: 12, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginBottom: 12 },
  subtitle: { fontSize: 16, color: Colors.text, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: Colors.lightBackground, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 8 },
  inputError: { borderColor: Colors.error },
  errorText: { color: Colors.error, fontSize: 13, marginBottom: 8 },
  button: { backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
}); 