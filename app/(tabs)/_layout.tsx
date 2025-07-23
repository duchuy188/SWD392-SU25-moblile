import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_KEY } from '@/services/authService';
import Avatar from '@/components/Avatar';
import { Tabs } from 'expo-router';
import {
  Home,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Contact,
  LogIn,
} from 'lucide-react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { authApi } from '@/services/authService';
import UserMenu from '@/components/UserMenu';
import useCurrentUser from '@/hooks/useCurrentUser';

export default function TabLayout() {
  const [user, setUser] = useCurrentUser();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      await AsyncStorage.clear();
      setUser(null);
      setModalVisible(false);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng xuất thất bại');
    }
  };

  const handleProfile = () => {
    setModalVisible(false);
    router.push('/profile'); // Điều hướng đến màn profile
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: Colors.primary,
        headerRight: () => {
          // Ẩn avatar khi ở tab 'contact'
          if (route.name === 'contact') return null;
          return user ? (
            <UserMenu
              user={user}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              onLogout={handleLogout}
              onProfile={handleProfile}
            />
          ) : (
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <LogIn size={18} color={Colors.primary} />
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              </TouchableOpacity>
            </Link>
          );
        },
        headerRightContainerStyle: styles.headerRightContainer,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: () => (
            <View style={styles.headerLogoContainer}>
              <Text style={styles.headerLogo}>EduBot</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="majors"
        options={{
          title: 'Ngành học',
          tabBarIcon: ({ color, size }) => (
            <GraduationCap size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="career"
        options={{
          title: 'Hướng nghiệp',
          tabBarIcon: ({ color, size }) => (
            <Briefcase size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Profile', // Đổi tên tab
          tabBarIcon: ({ color, size }) => (
            <Contact size={size} color={color} />
          ),
          headerTitle: 'My Profile', // Đổi tiêu đề header
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E0E0E0',
    height: 70,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 18,
  },
  headerLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  headerRightContainer: {
    paddingRight: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  loginButtonText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 60,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: Colors.text,
  },
});
