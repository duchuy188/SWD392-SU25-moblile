import { Tabs } from 'expo-router';
import { Home, GraduationCap, Briefcase, MessageSquare, Contact, LogIn, User } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Header right component - shows either login button or user avatar
  const renderHeaderRight = () => {
    if (isAuthenticated && user) {
      return (
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.loginButton}>
            <LogIn size={18} color={Colors.primary} />
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </Link>
      );
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: Colors.primary,
        headerRight: renderHeaderRight,
        headerRightContainerStyle: styles.headerRightContainer,
      }}>
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
          tabBarIcon: ({ color, size }) => <GraduationCap size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="career"
        options={{
          title: 'Hướng nghiệp',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Liên hệ',
          tabBarIcon: ({ color, size }) => <Contact size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E0E0E0',
    height: 60,
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
  avatarContainer: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

