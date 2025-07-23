import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Avatar({ email, profilePicture }: { email: string, profilePicture?: string }) {
  const firstChar = email?.charAt(0)?.toUpperCase() || '?';
  if (profilePicture) {
    return (
      <View style={styles.avatar}>
        <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
      </View>
    );
  }
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{firstChar}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7B61FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
  },
}); 