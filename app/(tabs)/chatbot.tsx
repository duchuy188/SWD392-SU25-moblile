import { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  FlatList 
} from 'react-native';
import { Send } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Message, ChatMessage } from '@/components/ChatMessage';
import { QuickReply } from '@/components/QuickReply';

// Initial messages and quick replies for the chatbot
const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Xin chào! Tôi là EduBot, trợ lý tư vấn học tập và hướng nghiệp. Bạn cần hỗ trợ gì?',
    isBot: true,
    timestamp: new Date(),
  },
];

const quickReplies = [
  { id: '1', text: 'Tìm hiểu ngành học' },
  { id: '2', text: 'Tư vấn nghề nghiệp' },
  { id: '3', text: 'Điểm chuẩn đại học' },
  { id: '4', text: 'Định hướng tương lai' },
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Cảm ơn câu hỏi của bạn về "${inputMessage}". Tôi đang xử lý thông tin và sẽ trả lời chi tiết ngay sau đây.`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      
      // Scroll to bottom after adding new messages
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  const handleQuickReply = (text: string) => {
    // Add the quick reply as a user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse: Message;
      
      switch(text) {
        case 'Tìm hiểu ngành học':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'Bạn quan tâm đến ngành học nào? Hiện nay có nhiều ngành học phổ biến như Công nghệ thông tin, Y dược, Kinh tế, Kỹ thuật, Khoa học xã hội,...',
            isBot: true,
            timestamp: new Date(),
          };
          break;
        case 'Tư vấn nghề nghiệp':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'Để tư vấn nghề nghiệp, tôi cần biết thêm về sở thích, năng lực và tính cách của bạn. Bạn thích làm việc theo nhóm hay độc lập? Bạn có điểm mạnh gì?',
            isBot: true,
            timestamp: new Date(),
          };
          break;
        case 'Điểm chuẩn đại học':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'Điểm chuẩn đại học thay đổi theo từng năm. Bạn quan tâm đến trường nào và khối nào? Tôi có thể cung cấp thông tin tham khảo về điểm chuẩn những năm gần đây.',
            isBot: true,
            timestamp: new Date(),
          };
          break;
        case 'Định hướng tương lai':
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'Định hướng tương lai là một quyết định quan trọng. Bạn có thể chia sẻ đam mê và mục tiêu của mình là gì không? Từ đó tôi có thể giúp bạn xây dựng lộ trình phù hợp.',
            isBot: true,
            timestamp: new Date(),
          };
          break;
        default:
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'Cảm ơn câu hỏi của bạn. Tôi đang xử lý thông tin và sẽ phản hồi ngay.',
            isBot: true,
            timestamp: new Date(),
          };
      }
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      
      // Scroll to bottom after adding new messages
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EduBot Chat</Text>
        <Text style={styles.headerSubtitle}>Hỏi đáp trực tiếp với trợ lý AI</Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </ScrollView>
      
      <View style={styles.quickRepliesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesContent}
        >
          {quickReplies.map((reply) => (
            <QuickReply
              key={reply.id}
              text={reply.text}
              onPress={() => handleQuickReply(reply.text)}
            />
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập câu hỏi..."
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            !inputMessage.trim() && styles.sendButtonDisabled
          ]} 
          onPress={handleSend}
          disabled={!inputMessage.trim()}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingTop: 8,
  },
  quickRepliesContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 12,
  },
  quickRepliesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.inactive,
  },
});