import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { authApi } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleSendResetLink = async () => {
    setEmailError('');
    if (!email.trim()) {
      setEmailError('Email không được để trống');
      return;
    } else if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsLoading(false);
      setIsSuccess(true);
      Alert.alert(
        'Thành công',
        'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và nhập mã OTP.',
        [
          {
            text: 'OK',
            onPress: () => router.replace({ pathname: '/(auth)/verify-otp', params: { email } })
          }
        ]
      );
    } catch (error: any) {
      setIsLoading(false);
      setEmailError(error?.message || 'Đã có lỗi xảy ra');
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <ArrowLeft size={20} color={Colors.text} />
              <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <Text style={styles.title}>Quên mật khẩu</Text>
              <Text style={styles.subtitle}>
                Vui lòng nhập địa chỉ email bạn đã đăng ký. Chúng tôi sẽ gửi cho bạn đường dẫn để đặt lại mật khẩu.
              </Text>
            </View>

            <Image
              source={{ uri: 'https://images.pexels.com/photos/8471931/pexels-photo-8471931.jpeg' }}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  placeholder="Nhập địa chỉ email của bạn"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              <TouchableOpacity
                style={[
                  styles.resetButton,
                  isLoading ? styles.resetButtonDisabled : null
                ]}
                onPress={handleSendResetLink}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.resetButtonText}>Đang gửi...</Text>
                ) : (
                  <View style={styles.resetButtonContent}>
                    <Text style={styles.resetButtonText}>Gửi đường dẫn đặt lại</Text>
                    <Send size={20} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: Colors.inactive,
  },
  resetButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
