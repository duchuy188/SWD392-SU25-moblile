import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Avatar, Card, List, Switch, Button, Divider, useTheme } from 'react-native-paper';
import { LogOut, User, Settings, HelpCircle, Moon, Info, FileText } from 'lucide-react-native';
import { authApi } from '@/services/authService';

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
  const theme = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getCurrentUser();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <Card style={{ margin: 32, padding: 32 }}><List.Item title="Đang tải..." /></Card>;
  }

  if (!user) {
    return <Card style={{ margin: 32, padding: 32 }}><List.Item title="Không thể tải thông tin người dùng." /></Card>;
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
            description={user.jobTitle || 'Web Designer'}
            titleStyle={styles.name}
            descriptionStyle={styles.job}
            left={() => null}
          />
        </View>
      </Card>

      <Card style={styles.menuCard}>
        <List.Section>
          <List.Subheader style={styles.subheader}>Profile</List.Subheader>
          <List.Item
            title="Personal Data"
            left={() => <User color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Settings"
            left={() => <Settings color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Subheader style={styles.subheader}>Support</List.Subheader>
          <List.Item
            title="Help Center"
            left={() => <HelpCircle color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Dark Mode"
            left={() => <Moon color={theme.colors.primary} size={22} />}
            right={() => (
              <Switch value={darkMode} onValueChange={setDarkMode} color={theme.colors.primary} />
            )}
          />
          <List.Item
            title="Info App"
            left={() => <Info color={theme.colors.primary} size={22} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Term and Conditions"
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
        onPress={() => {}}
      >
        Logout
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
