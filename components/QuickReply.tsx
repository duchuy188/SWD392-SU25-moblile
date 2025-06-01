import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

type QuickReplyProps = {
  text: string;
  onPress: () => void;
};

export function QuickReply({ text, onPress }: QuickReplyProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  text: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});