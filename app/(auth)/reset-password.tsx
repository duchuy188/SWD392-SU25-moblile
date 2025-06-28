import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authApi } from '@/components/api/authService';
import Colors from '@/constants/Colors';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email, resetToken } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword(email as string, resetToken as string, newPassword);
      setIsLoading(false);
      Alert.alert('Thành công', 'Đặt lại mật khẩu thành công', [
        { text: 'Đăng nhập', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Đã có lỗi xảy ra');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Đặt lại mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu mới"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center' },
  innerContainer: { padding: 24, backgroundColor: '#fff', margin: 24, borderRadius: 12, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: Colors.lightBackground, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 8 },
  errorText: { color: Colors.error, fontSize: 13, marginBottom: 8 },
  button: { backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
}); 