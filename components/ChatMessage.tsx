import { StyleSheet, Text, View, Image } from 'react-native';
import Colors from '@/constants/Colors';
import React from 'react';

export type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  imageUri?: string;
};

type ChatMessageProps = {
  message: Message;
  customContent?: React.ReactNode;
};

export function ChatMessage({ message, customContent }: ChatMessageProps) {
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.messageContainer,
        message.isBot
          ? styles.botMessageContainer
          : styles.userMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isBot ? styles.botMessageBubble : styles.userMessageBubble,
        ]}
      >
        {message.imageUri && (
          <Image
            source={{ uri: message.imageUri }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        {customContent ? (
          customContent
        ) : (
          <Text
            style={[
              styles.messageText,
              message.isBot ? styles.botMessageText : styles.userMessageText,
            ]}
          >
            {message.text}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.timestamp,
          message.isBot
            ? { alignSelf: 'flex-start' }
            : { alignSelf: 'flex-end' },
        ]}
      >
        {formattedTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  botMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userMessageBubble: {
    backgroundColor: Colors.primary,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  botMessageText: {
    color: Colors.text,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
    marginHorizontal: 4,
  },
});
