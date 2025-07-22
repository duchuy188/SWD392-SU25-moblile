import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, Alert } from 'react-native';
import { Card, List, useTheme, Avatar, Button, TextInput } from 'react-native-paper';
import { authApi } from '@/services/authService';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  studentID: string;
  profilePicture: string;
}

export default function ProfileInfoScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    profilePicture: '',
  });
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getCurrentUser();
        setUser(data.user);
        setForm({
          fullName: data.user.fullName || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          profilePicture: data.user.profilePicture || '',
        });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [editMode]);

  const handleBack = () => router.back();

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => setEditMode(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      await authApi.updateUser(form);
      // Gọi lại API lấy user mới
      const data = await authApi.getCurrentUser();
      setUser(data.user);
      setEditMode(false);
    } catch (e) {
      Alert.alert('Lỗi', 'Cập nhật thông tin thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Card style={{ margin: 32, padding: 32 }}><List.Item title={<Text>Đang tải...</Text>} /></Card>;
  }

  if (!user) {
    return <Card style={{ margin: 32, padding: 32 }}><List.Item title={<Text>Không thể tải thông tin người dùng.</Text>} /></Card>;
  }

  // Component cho từng trường thông tin
  const ProfileField = ({ icon, label, value, isLast = false }: { icon: FeatherIconName, label: string, value: string, isLast?: boolean }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingVertical: 12,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: '#F0EEF6',
      marginBottom: 0,
    }}>
      <Feather name={icon} size={20} color="#7C3AED" style={{ marginRight: 16 }} />
      <View>
        <Text style={{ fontSize: 13, color: '#A09CB0' }}>{label}</Text>
        <Text style={{ fontSize: 17, fontWeight: '500', color: '#2D176B' }}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F4F8' }}>
      {/* Thanh nút trên cùng */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        marginBottom: 8,
      }}>
        <Button
          mode="outlined"
          onPress={handleBack}
          style={{ borderRadius: 16, minWidth: 90 }}
          labelStyle={{ fontWeight: 'bold', color: '#7C3AED' }}
        >
          Quay lại
        </Button>
        {!editMode && (
          <Button
            mode="contained"
            onPress={handleEdit}
            style={{ borderRadius: 16, minWidth: 90, backgroundColor: '#7C3AED' }}
            labelStyle={{ fontWeight: 'bold', fontSize: 15 }}
          >
            Chỉnh sửa
          </Button>
        )}
        {editMode && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={{ borderRadius: 16, minWidth: 70, marginRight: 8 }}
              labelStyle={{ fontWeight: 'bold', color: '#7C3AED' }}
            >
              Huỷ
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={{ borderRadius: 16, minWidth: 70, backgroundColor: '#7C3AED' }}
              labelStyle={{ fontWeight: 'bold', fontSize: 15 }}
            >
              Lưu
            </Button>
          </View>
        )}
      </View>
      {/* Avatar và Card thông tin */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        {/* Avatar nổi bật */}
        <View style={{
          position: 'absolute',
          top: 0,
          zIndex: 2,
          alignSelf: 'center',
          shadowColor: '#7C3AED',
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }}>
          {user.profilePicture ? (
            <Avatar.Image
              size={110}
              source={{ uri: user.profilePicture }}
              style={{ borderWidth: 4, borderColor: '#fff', backgroundColor: '#E9E6F7' }}
            />
          ) : (
            <Avatar.Text
              size={110}
              label={user.fullName ? user.fullName.trim().charAt(0).toUpperCase() : '?'}
              style={{ borderWidth: 4, borderColor: '#fff', backgroundColor: '#E9E6F7' }}
            />
          )}
        </View>
        {/* Card thông tin */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 32,
          paddingTop: 70,
          paddingBottom: 32,
          paddingHorizontal: 28,
          width: '90%',
          marginTop: 60,
          shadowColor: '#000',
          shadowOpacity: 0.10,
          shadowRadius: 18,
          elevation: 8,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#2D176B', textAlign: 'center' }}>
            {user.fullName}
          </Text>
          {!editMode ? (
            <>
              <ProfileField icon="mail" label="Email" value={user.email} />
              <ProfileField icon="phone" label="Số điện thoại" value={user.phone} />
              <ProfileField icon="map-pin" label="Địa chỉ" value={user.address} />
              <ProfileField icon="user" label="Vai trò" value={user.role} isLast />
            </>
          ) : (
            <View style={{ width: '100%', marginTop: 0 }}>
              <TextInput
                label="Họ và tên"
                value={form.fullName}
                onChangeText={text => handleChange('fullName', text)}
                style={{ marginBottom: 8 }}
              />
              <TextInput
                label="Số điện thoại"
                value={form.phone}
                onChangeText={text => handleChange('phone', text)}
                style={{ marginBottom: 8 }}
              />
              <TextInput
                label="Địa chỉ"
                value={form.address}
                onChangeText={text => handleChange('address', text)}
                style={{ marginBottom: 8 }}
              />
              <TextInput
                label="Link ảnh đại diện"
                value={form.profilePicture}
                onChangeText={text => handleChange('profilePicture', text)}
                style={{ marginBottom: 8 }}
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    paddingBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  email: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
}); 