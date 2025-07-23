import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Dimensions, Modal, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Card, Avatar, Button, TextInput } from 'react-native-paper';
import { authApi } from '@/services/authService';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const PRIMARY = '#7C3AED';
const BG = '#F3F4F8';
const CARD_BG = '#fff';
const BORDER = '#E0E0E0';
const TEXT = '#2D176B';
const SUBTEXT = '#A09CB0';

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
  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(form.profilePicture);

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
  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });
  const handleSave = async () => {
    setLoading(true);
    try {
      console.log('Trước khi gửi lên API:', form.profilePicture);
      await authApi.updateUser(form);
      const data = await authApi.getCurrentUser();
      console.log('Sau khi lấy từ API:', data.user.profilePicture);
      setUser(data.user);
      setForm({
        fullName: data.user.fullName || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
        profilePicture: data.user.profilePicture || '',
      });
      // router.back(); 
      router.replace('/(auth)/profile-info'); // Quay về đúng trang profile-info
    } catch (e) {
      alert('Cập nhật thông tin thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Card style={{ margin: 32, padding: 32 }}><Text>Đang tải...</Text></Card>;
  }
  if (!user) {
    return <Card style={{ margin: 32, padding: 32 }}><Text>Không thể tải thông tin người dùng.</Text></Card>;
  }

  // ProfileField component
  const ProfileField = ({ icon, label, value, isLast = false }: { icon: any, label: string, value: string, isLast?: boolean }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingVertical: 14,
      borderBottomWidth: isLast ? 0 : 1.5,
      borderBottomColor: BORDER,
      marginBottom: 0,
      gap: 12,
    }}>
      <Feather name={icon} size={20} color={PRIMARY} style={{ marginRight: 2 }} />
      <View>
        <Text style={{ fontSize: 13, color: SUBTEXT }}>{label}</Text>
        <Text style={{ fontSize: 17, fontWeight: '500', color: TEXT }}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          {/* Card avatar riêng biệt */}
          <View style={{
            width: '92%',
            height: 220,
            backgroundColor: CARD_BG,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            justifyContent: 'flex-start',
            alignItems: 'center',
            shadowColor: PRIMARY,
            shadowOpacity: 0.10,
            shadowRadius: 18,
            elevation: 8,
            zIndex: 20,
            marginBottom: -60, // Để card avatar "đè" lên card thông tin
            paddingTop: 32,
          }}>
            <TouchableOpacity
              activeOpacity={editMode ? 0.7 : 1}
              onPress={() => editMode && setAvatarModalVisible(true)}
              style={{
                width: 90,
                height: 90,
                borderRadius: 18,
                backgroundColor: '#E9E6F7',
                borderWidth: 4,
                borderColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: PRIMARY,
                shadowOpacity: 0.10,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {form.profilePicture ? (
                <Avatar.Image
                  size={70}
                  source={{ uri: form.profilePicture }}
                  style={{ backgroundColor: '#E9E6F7', borderRadius: 14 }}
                />
              ) : (
                <Avatar.Text
                  size={70}
                  label={user.fullName ? user.fullName.trim().charAt(0).toUpperCase() : '?'}
                  style={{ backgroundColor: '#E9E6F7', borderRadius: 14 }}
                  labelStyle={{ color: PRIMARY }}
                />
              )}
              {/* Hiệu ứng overlay khi edit */}
              {editMode && (
                <View style={{
                  position: 'absolute',
                  left: 0, right: 0, top: 0, bottom: 0,
                  backgroundColor: 'rgba(124, 58, 237, 0.08)',
                  borderRadius: 18,
                  justifyContent: 'center', alignItems: 'center',
                }}>
                  <Feather name="edit-2" size={22} color={PRIMARY} />
                </View>
              )}
            </TouchableOpacity>
            {/* Modal nhập link ảnh */}
            <Modal
              visible={avatarModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setAvatarModalVisible(false)}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 24, width: '80%', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 17, color: PRIMARY, marginBottom: 12 }}>Đổi ảnh đại diện</Text>
                  {/* Preview ảnh nếu có link */}
                  {tempAvatar ? (
                    <Avatar.Image
                      size={70}
                      source={{ uri: tempAvatar }}
                      style={{ backgroundColor: '#E9E6F7', borderRadius: 14, marginBottom: 10 }}
                    />
                  ) : null}
                  <RNTextInput
                    value={tempAvatar}
                    onChangeText={setTempAvatar}
                    placeholder="Dán link ảnh..."
                    style={{ borderWidth: 1, borderColor: BORDER, borderRadius: 10, width: '100%', padding: 10, marginBottom: 16 }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Button mode="outlined" onPress={() => setAvatarModalVisible(false)} style={{ borderRadius: 10, minWidth: 70 }} labelStyle={{ color: PRIMARY }}>Huỷ</Button>
                    <Button mode="contained" onPress={() => { setForm(f => ({ ...f, profilePicture: tempAvatar })); setAvatarModalVisible(false); }} style={{ borderRadius: 10, minWidth: 70, backgroundColor: PRIMARY }} labelStyle={{ color: '#fff' }}>Lưu</Button>
                  </View>
                </View>
              </View>
            </Modal>
            {/* Tên user trên card avatar */}
            <Text style={{
              fontSize: 26,
              fontWeight: 'bold',
              color: TEXT,
              marginTop: 18,
              textAlign: 'center',
              letterSpacing: 0.5,
            }}>
              {user.fullName}
            </Text>
            {/* Nút edit nổi góc phải card avatar */}
            {!editMode && (
              <View style={{ position: 'absolute', top: 12, right: 16, zIndex: 30 }}>
                <Button
                  onPress={handleEdit}
                  style={{
                    minWidth: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#fff',
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: BORDER,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  contentStyle={{ padding: 0, justifyContent: 'center', alignItems: 'center' }}
                  labelStyle={{ padding: 0 }}
                >
                  <Feather name="edit-2" size={18} color={PRIMARY} />
                </Button>
              </View>
            )}
          </View>
          {/* Card thông tin */}
          <View style={{
            backgroundColor: CARD_BG,
            borderRadius: 32,
            paddingTop: 40,
            paddingBottom: 32,
            paddingHorizontal: 28,
            width: '92%',
            marginTop: 32,
            shadowColor: PRIMARY,
            shadowOpacity: 0.10,
            shadowRadius: 18,
            elevation: 8,
            alignItems: 'center',
            minHeight: 320,
          }}>
            {!editMode ? (
              <View style={{ width: '100%', marginTop: 8 }}>
                <ProfileField icon="mail" label="Email" value={user.email} />
                <ProfileField icon="phone" label="Số điện thoại" value={user.phone} />
                <ProfileField icon="map-pin" label="Địa chỉ" value={user.address} />
                <ProfileField icon="user" label="Vai trò" value={user.role} isLast />
              </View>
            ) : (
              <View style={{ width: '100%', marginTop: 0 }}>
                <TextInput
                  label="Họ và tên"
                  value={form.fullName}
                  onChangeText={text => handleChange('fullName', text)}
                  style={{
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: BORDER,
                    fontSize: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                  theme={{ colors: { primary: PRIMARY, text: TEXT, placeholder: SUBTEXT } }}
                />
                <TextInput
                  label="Số điện thoại"
                  value={form.phone}
                  onChangeText={text => handleChange('phone', text)}
                  style={{
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: BORDER,
                    fontSize: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                  theme={{ colors: { primary: PRIMARY, text: TEXT, placeholder: SUBTEXT } }}
                />
                <TextInput
                  label="Địa chỉ"
                  value={form.address}
                  onChangeText={text => handleChange('address', text)}
                  style={{
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: BORDER,
                    fontSize: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                  theme={{ colors: { primary: PRIMARY, text: TEXT, placeholder: SUBTEXT } }}
                />
                {/* Không còn input Link ảnh đại diện */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={{ borderRadius: 16, minWidth: 70, borderColor: PRIMARY, borderWidth: 1.5 }}
                    labelStyle={{ fontWeight: 'bold', color: PRIMARY }}
                  >
                    Huỷ
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    style={{ borderRadius: 16, minWidth: 70, backgroundColor: PRIMARY }}
                    labelStyle={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}
                  >
                    Lưu
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      {/* Nút quay lại luôn cố định ở cạnh dưới màn hình */}
      <View style={{ position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center', zIndex: 100 }}>
        <Button
          mode="contained"
          onPress={handleBack}
          style={{
            backgroundColor: PRIMARY,
            borderRadius: 30,
            paddingHorizontal: 40,
            paddingVertical: 16,
            elevation: 8,
            shadowColor: PRIMARY,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            width: '90%',
          }}
          labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}
        >
          Quay lại
        </Button>
      </View>
    </View>
  );
}