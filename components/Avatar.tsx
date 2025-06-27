import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Avatar({ email }: { email: string }) {
  const firstChar = email?.charAt(0)?.toUpperCase() || '?';
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
}); 