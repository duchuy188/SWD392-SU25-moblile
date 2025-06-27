import React from 'react';
import { Pressable, View, Text, Modal, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import Colors from '@/constants/Colors';

type UserMenuProps = {
  user: any;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onLogout: () => void;
  onProfile: () => void;
};

export default function UserMenu({
  user,
  modalVisible,
  setModalVisible,
  onLogout,
  onProfile,
}: UserMenuProps) {
  if (!user) return null;
  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <Avatar email={user.email} />
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.menuContainer}>
            <Pressable style={styles.menuItem} onPress={onProfile}>
              <Text style={styles.menuText}>Profile</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={onLogout}>
              <Text style={[styles.menuText, { color: Colors.error }]}>Đăng xuất</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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