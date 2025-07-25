import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import { Card, Avatar, Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
  });
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const router = useRouter();
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getCurrentUser();
        setUser(data.user);
        setForm({
          fullName: data.user.fullName || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
        });
        setPreviewUrl(''); // Reset preview khi load data
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);



  // Chọn ảnh từ thư viện
  const pickImageFromLibrary = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Thông báo', 'Cần cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4, // giảm quality để file nhỏ hơn 2MB
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
        setPreviewUrl(asset.uri);
        setAvatarModalVisible(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi chọn ảnh');
    }
  };

  // Chụp ảnh từ camera
  const takePhotoWithCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Thông báo', 'Cần cấp quyền truy cập camera để chụp ảnh đại diện');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4, // giảm quality để file nhỏ hơn 2MB
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
        setPreviewUrl(asset.uri);
        setAvatarModalVisible(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi chụp ảnh');
    }
  };

  const handleBack = () => router.back();
  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setSelectedFile(null);
    setPreviewUrl('');
    // Reset form về dữ liệu gốc
    if (user) {
      setForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  };
  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });
  
  const handleSave = async () => {
    // Kiểm tra dữ liệu
    if (!form.fullName.trim()) {
      Alert.alert('Lỗi', 'Họ và tên không được để trống!');
      return;
    }
    if (!form.address.trim()) {
      Alert.alert('Lỗi', 'Địa chỉ không được để trống!');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      Alert.alert('Lỗi', 'Số điện thoại phải gồm 10 chữ số và không chứa ký tự chữ!');
      return;
    }
    setLoading(true);
    setUploadingImage(true);
    try {
      let updatedUserData;
      if (selectedFile) {
        // Nếu có ảnh mới, gửi FormData
        const formData = new FormData();
        formData.append('fullName', form.fullName);
        formData.append('phone', form.phone);
        formData.append('address', form.address);
        formData.append('profilePicture', {
          uri: selectedFile.uri,
          type: selectedFile.type || 'image/jpeg',
          name: selectedFile.name || 'avatar.jpg',
        } as any);
        updatedUserData = await authApi.updateUser(formData);
      } else {
        // Không có ảnh mới, gửi JSON bình thường, truyền luôn profilePicture hiện tại
        const updateData = {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          profilePicture: user?.profilePicture || '',
        };
        updatedUserData = await authApi.updateUser(updateData);
      }
      if (updatedUserData && updatedUserData.user) {
        setUser(updatedUserData.user);
        setForm({
          fullName: updatedUserData.user.fullName || '',
          phone: updatedUserData.user.phone || '',
          address: updatedUserData.user.address || '',
        });
      }
      setEditMode(false);
      setSelectedFile(null);
      setPreviewUrl('');
      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Lỗi', 'Cập nhật thông tin thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
      setUploadingImage(false);
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

  // Hiển thị ảnh hiện tại (có thể là preview hoặc ảnh từ server)
  const getCurrentImageUri = () => {
    if (previewUrl) return previewUrl; // Ưu tiên ảnh preview
    if (user?.profilePicture) return user.profilePicture; // Ảnh từ server
    return null;
  };

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
            marginBottom: -60,
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
              {getCurrentImageUri() ? (
                <Avatar.Image
                  size={70}
                  source={{ uri: getCurrentImageUri()! }}
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
                  <Feather name="camera" size={22} color={PRIMARY} />
                </View>
              )}
              
              {/* Loading indicator khi đang upload */}
              {uploadingImage && (
                <View style={{
                  position: 'absolute',
                  left: 0, right: 0, top: 0, bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 18,
                  justifyContent: 'center', alignItems: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>Đang tải...</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Modal chọn cách upload ảnh */}
            <Modal
              visible={avatarModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setAvatarModalVisible(false)}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 24, width: '80%', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 17, color: PRIMARY, marginBottom: 20 }}>
                    Đổi ảnh đại diện
                  </Text>
                  
                  <View style={{ width: '100%', gap: 12 }}>
                    <Button
                      mode="contained"
                      onPress={pickImageFromLibrary}
                      style={{ borderRadius: 12, backgroundColor: PRIMARY }}
                      labelStyle={{ color: '#fff', paddingVertical: 8 }}
                      icon={() => <Feather name="image" size={18} color="#fff" />}
                      disabled={uploadingImage}
                    >
                      Chọn từ thư viện
                    </Button>
                    
                    <Button
                      mode="outlined"
                      onPress={takePhotoWithCamera}
                      style={{ borderRadius: 12, borderColor: PRIMARY }}
                      labelStyle={{ color: PRIMARY, paddingVertical: 8 }}
                      icon={() => <Feather name="camera" size={18} color={PRIMARY} />}
                      disabled={uploadingImage}
                    >
                      Chụp ảnh mới
                    </Button>
                    
                    <Button
                      mode="text"
                      onPress={() => setAvatarModalVisible(false)}
                      style={{ borderRadius: 12, marginTop: 8 }}
                      labelStyle={{ color: SUBTEXT }}
                      disabled={uploadingImage}
                    >
                      Hủy
                    </Button>
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
              <TouchableOpacity
                onPress={handleEdit}
                style={{ position: 'absolute', top: 12, right: 16, zIndex: 30, padding: 6 }}
                activeOpacity={0.7}
              >
                <Feather name="edit-2" size={22} color={PRIMARY} />
              </TouchableOpacity>
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
                <ProfileField icon="phone" label="Số điện thoại" value={user.phone || '—'} />
                <ProfileField icon="map-pin" label="Địa chỉ" value={user.address || '—'} />
                <ProfileField icon="user" label="Vai trò" value={user.role === 'student' ? 'Học Sinh' : user.role} isLast />
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
                
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={{ borderRadius: 16, minWidth: 70, borderColor: PRIMARY, borderWidth: 1.5 }}
                    labelStyle={{ fontWeight: 'bold', color: PRIMARY }}
                    disabled={uploadingImage}
                  >
                    Huỷ
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    style={{ borderRadius: 16, minWidth: 70, backgroundColor: PRIMARY }}
                    labelStyle={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}
                    disabled={uploadingImage}
                    loading={uploadingImage}
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