import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Text } from 'react-native';
import { Avatar, Card, List, Switch, Button, Divider, useTheme } from 'react-native-paper';
import { LogOut, User, Settings, HelpCircle, Moon, Info, FileText } from 'lucide-react-native';
import { authApi } from '@/services/authService';
import { getMyTestResults } from '@/services/testService';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  studentID: string;
  profilePicture: string;
  jobTitle?: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showTestHistory, setShowTestHistory] = useState(false);
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [loadingTestHistory, setLoadingTestHistory] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchProfile = async () => {
        try {
          const data = await authApi.getCurrentUser();
          if (isActive) setUser(data.user);
        } catch (error) {
          if (isActive) setUser(null);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchProfile();
      return () => { isActive = false; };
    }, [])
  );

  const handleShowTestHistory = async () => {
    setShowTestHistory(true);
    setLoadingTestHistory(true);
    try {
      const data = await getMyTestResults();
      setTestHistory(data);
    } catch (e) {
      setTestHistory([]);
    } finally {
      setLoadingTestHistory(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      await AsyncStorage.clear();
      router.replace('/login');
    } catch (error) {
      // Có thể hiển thị thông báo lỗi nếu muốn
    }
  };

  if (loading) {
    return <Card style={{ margin: 32, padding: 32 }}><List.Item title={<Text>Đang tải...</Text>} /></Card>;
  }

  if (!user) {
    return <Card style={{ margin: 32, padding: 32 }}><List.Item title={<Text>Không thể tải thông tin người dùng.</Text>} /></Card>;
  }

  if (showTestHistory) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Card style={styles.profileCard}>
          <List.Item
            title={<Text>Lịch sử kiểm tra</Text>}
            left={() => <FileText color={theme.colors.primary} size={22} />}
            right={() => null}
          />
        </Card>
        <Button onPress={() => setShowTestHistory(false)} style={{margin: 16}}><Text>Quay lại</Text></Button>
        {loadingTestHistory ? (
          <Card style={{ margin: 32, padding: 32 }}><List.Item title={<Text>Đang tải...</Text>} /></Card>
        ) : (
          testHistory.length === 0 ? (
            <Card style={{ margin: 32, padding: 32 }}><List.Item title={<Text>Không có lịch sử kiểm tra.</Text>} /></Card>
          ) : (
            testHistory.map((item, idx) => (
              <Card key={idx} style={{ margin: 12, padding: 12 }}>
                <List.Item
                  title={<Text>{item.testName}</Text>}
                  description={<Text>Loại: {item.testType} | Kết quả: {item.result} | Ngày: {item.date ? new Date(item.date).toLocaleString() : ''}</Text>}
                  left={() => <FileText color={theme.colors.primary} size={22} />}
                />
              </Card>
            ))
          )
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={styles.profileCard}>
        <ImageBackground
          source={{ uri: user.profilePicture || 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.cover}
          imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
          blurRadius={1.5}
        >
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={90}
              source={{ uri: user.profilePicture || 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={styles.avatar}
            />
          </View>
        </ImageBackground>
        <View style={styles.infoContainer}>
          <List.Item
            title={user.fullName}
            description={user.role === 'student' ? 'Học Sinh' : user.role}
            titleStyle={styles.name}
            descriptionStyle={styles.job}
            left={() => null}
          />
        </View>
      </Card>

      <Card style={styles.menuCard}>
        <List.Section>
          <List.Subheader style={styles.subheader}>Thông tin cá nhân</List.Subheader>
          <List.Item
            title="Dữ liệu cá nhân"
            left={() => <User color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => router.push('/(auth)/profile-info')}
          />
          <List.Item
            title="Lịch sử kiểm tra"
            left={() => <FileText color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => router.push('/(auth)/test-history')}
          />
          <List.Item
            title="Cài đặt"
            left={() => <Settings color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Subheader style={styles.subheader}>Hỗ trợ</List.Subheader>
          <List.Item
            title="Trung tâm trợ giúp"
            left={() => <HelpCircle color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Thông tin ứng dụng"
            left={() => <Info color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Điều khoản và điều kiện"
            left={() => <FileText color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>
      </Card>

      <Button
        mode="outlined"
        icon={() => <LogOut color={theme.colors.primary} size={22} />}
        style={styles.logoutButton}
        labelStyle={styles.logoutLabel}
        onPress={handleLogout}
      >
        Đăng xuất
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  cover: {
    height: 120,
    backgroundColor: '#eee',
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: -45,
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  job: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
  menuCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    elevation: 2,
    overflow: 'hidden',
  },
  subheader: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#444',
    marginTop: 8,
  },
  logoutButton: {
    margin: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#bbb',
    paddingVertical: 6,
  },
  logoutLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
});