import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  ImagePlus,
  Menu,
  Send,
  Plus,
  MessageSquare,
  X,
  MoreVertical,
  Trash2,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Message, ChatMessage } from '@/components/ChatMessage';
import { QuickReply } from '@/components/QuickReply';
import {
  createNewConversation,
  deleteConversationById,
  getConversationHistory,
  getConversationById,
  sendMessage,
} from '@/services/chatAIService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from '@/services/authService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Interface cho chat history
interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}
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
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);
  const [isBotReplying, setIsBotReplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnimation = useRef(
    new Animated.Value(-SCREEN_WIDTH * 0.8)
  ).current;

  // Use expo-router for navigation
  const router = require('expo-router').router;

  // Check login status on mount
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoggedIn(false);
        Alert.alert('Vui lòng đăng nhập', 'Bạn cần đăng nhập để sử dụng chatbot.', [
          {
            text: 'Đăng nhập',
            onPress: () => {
              if (router) router.replace('/login');
            },
          },
        ]);
      } else {
        setIsLoggedIn(true);
      }
    };
    checkLogin();
  }, []);

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnimation, {
      toValue: -SCREEN_WIDTH * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuOpen(false);
    });
  };

  const handleDeleteChat = async (chatId: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa đoạn chat này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteConversationById(chatId);
              setChatHistory((prev) =>
                prev.filter((chat) => chat.id !== chatId)
              );

              if (currentChatId === chatId) {
                setMessages(initialMessages);
                setCurrentChatId(null);
              }

              setShowDeleteMenu(null);
              Alert.alert('Thành công', 'Đã xóa đoạn chat');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa đoạn chat');
            }
          },
        },
      ]
    );
  };

  const toggleDeleteMenu = (chatId: string) => {
    setShowDeleteMenu(showDeleteMenu === chatId ? null : chatId);
  };

  const handleSend = async () => {
    if (!isLoggedIn) {
      Alert.alert('Vui lòng đăng nhập', 'Bạn cần đăng nhập để sử dụng chatbot.', [
        {
          text: 'Đăng nhập',
          onPress: () => {
            if (router) router.replace('/login');
          },
        },
      ]);
      return;
    }
    if (inputMessage.trim() === '' || isBotReplying) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, { id: 'loading', text: '...', isBot: true, timestamp: new Date() }]);
    setIsBotReplying(true);
    const currentInput = inputMessage;
    setInputMessage('');

    try {
      const response = await sendMessage(
        currentInput,
        currentChatId || undefined
      );

      // Kiểm tra response có lỗi không
      if (!response || response.error) {
        setErrorMessage(response?.error || 'API response error');
        throw new Error(response?.error || 'API response error');
      }

      setMessages((prevMessages) => {
        // Xóa message loading
        const filtered = prevMessages.filter((msg) => msg.id !== 'loading');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          text: response.response || 'Xin lỗi, không nhận được phản hồi từ server.',
          isBot: true,
          timestamp: new Date(),
        }];
      });

      if (!currentChatId && response.chatId) {
        setCurrentChatId(response.chatId);
      }

      await loadInitialChatHistory();
      setErrorMessage(null);
    } catch (error: any) {
      setMessages((prevMessages) => {
        const filtered = prevMessages.filter((msg) => msg.id !== 'loading');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          text: 'Xin lỗi, server đang bảo trì. Vui lòng thử lại sau.',
          isBot: true,
          timestamp: new Date(),
        }];
      });
      if (error?.message) setErrorMessage(error.message);
    } finally {
      setIsBotReplying(false);
    }
  };

  const handleQuickReply = async (text: string) => {
    if (!isLoggedIn) {
      Alert.alert('Vui lòng đăng nhập', 'Bạn cần đăng nhập để sử dụng chatbot.', [
        {
          text: 'Đăng nhập',
          onPress: () => {
            if (router) router.replace('/login');
          },
        },
      ]);
      return;
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await sendMessage(text, currentChatId || undefined);

      if (response.error?.includes('đăng nhập lại')) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setErrorMessage('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        return;
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);

      if (!currentChatId && response.chatId) {
        setCurrentChatId(response.chatId);
      }

      await loadInitialChatHistory();
      setErrorMessage(null);
    } catch (error: any) {
      if (error?.status === 401) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setErrorMessage('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        return;
      }

      setErrorMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.');
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
    }
  };

  const handleAddImage = async () => {
    if (!isLoggedIn) {
      Alert.alert('Vui lòng đăng nhập', 'Bạn cần đăng nhập để sử dụng chatbot.', [
        {
          text: 'Đăng nhập',
          onPress: () => {
            if (router) router.replace('/login');
          },
        },
      ]);
      return;
    }
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
      Alert.alert(
        'Thông báo',
        'Cần cấp quyền truy cập camera và thư viện ảnh để sử dụng tính năng này.'
      );
      return;
    }

    Alert.alert(
      'Chọn hình ảnh',
      'Bạn muốn chọn hình ảnh từ đâu?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thư viện ảnh', onPress: () => pickImageFromLibrary() },
        { text: 'Chụp ảnh', onPress: () => takePhoto() },
      ],
      { cancelable: true }
    );
  };

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleImageSelected(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện.');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleImageSelected(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chụp ảnh.');
    }
  };

  const handleImageSelected = async (
    imageAsset: ImagePicker.ImagePickerAsset
  ) => {
    if (!isLoggedIn) {
      Alert.alert('Vui lòng đăng nhập', 'Bạn cần đăng nhập để sử dụng chatbot.', [
        {
          text: 'Đăng nhập',
          onPress: () => {
            if (router) router.replace('/login');
          },
        },
      ]);
      return;
    }
    const imageMessage: Message = {
      id: Date.now().toString(),
      text: 'Đã gửi hình ảnh',
      isBot: false,
      timestamp: new Date(),
      imageUri: imageAsset.uri,
    };

    setMessages((prevMessages) => [...prevMessages, imageMessage]);

    try {
      const imageData = {
        uri: imageAsset.uri,
        name: imageAsset.fileName || `image_${Date.now()}.jpg`,
        type: imageAsset.mimeType || 'image/jpeg',
      };

      const response = await sendMessage(
        'Phân tích hình ảnh này giúp tôi',
        currentChatId || undefined,
        imageData
      );

      if (response.error?.includes('đăng nhập lại')) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setErrorMessage('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        return;
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);

      if (!currentChatId && response.chatId) {
        setCurrentChatId(response.chatId);
      }

      await loadInitialChatHistory();
      setErrorMessage(null);
    } catch (error: any) {
      if (error?.status === 401) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setErrorMessage('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        return;
      }

      setErrorMessage('Xin lỗi, không thể xử lý hình ảnh. Vui lòng thử lại.');
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, không thể xử lý hình ảnh. Vui lòng thử lại.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
    }
  };

  useEffect(() => {
    loadInitialChatHistory();
  }, []);

  const loadInitialChatHistory = async () => {
    try {
      const response = await getConversationHistory();

      if (response?.conversations?.length > 0) {
        const formattedHistory = response.conversations.map((conv: any) => ({
          id: conv._id,
          title:
            conv.interactions.length > 0
              ? conv.interactions[0].query.slice(0, 30) + '...'
              : 'Chat mới',
          lastMessage:
            conv.interactions.length > 0
              ? conv.interactions[conv.interactions.length - 1].response.slice(
                  0,
                  50
                ) + '...'
              : '',
          timestamp: new Date(conv.createdAt),
          messages: [],
        }));
        setChatHistory(formattedHistory);
      } else {
        setChatHistory([]);
      }
    } catch (error: any) {
      // Đã bỏ log lỗi ra console
      setChatHistory([]);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await createNewConversation();

      if (response.error?.includes('đăng nhập lại')) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại');
        return;
      }

      setMessages(initialMessages);
      setInputMessage('');
      setCurrentChatId(response.chatId);
      await loadInitialChatHistory();
      closeMenu();
    } catch (error: any) {
      if (error?.status === 401) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại');
        return;
      }

      setMessages(initialMessages);
      setInputMessage('');
      setCurrentChatId(null);
      closeMenu();
    }
  };

  const loadChatHistory = async (chat: ChatHistory) => {
    try {
      const response = await getConversationById(chat.id);

      if (response.error?.includes('đăng nhập lại')) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại');
        return;
      }

      if (response.conversation?.interactions) {
        const loadedMessages: Message[] = [];

        loadedMessages.push({
          id: '1',
          text: 'Xin chào! Tôi là EduBot, trợ lý tư vấn học tập và hướng nghiệp. Bạn cần hỗ trợ gì?',
          isBot: true,
          timestamp: new Date(response.conversation.createdAt),
        });

        response.conversation.interactions.forEach(
          (interaction: any, index: number) => {
            loadedMessages.push({
              id: `user_${index}`,
              text: interaction.query,
              isBot: false,
              timestamp: new Date(interaction.timestamp),
            });

            loadedMessages.push({
              id: `bot_${index}`,
              text: interaction.response,
              isBot: true,
              timestamp: new Date(interaction.timestamp),
            });
          }
        );

        setMessages(loadedMessages);
      } else {
        setMessages(initialMessages);
      }

      setCurrentChatId(chat.id);
      setInputMessage('');
      closeMenu();
    } catch (error: any) {
      if (error?.status === 401) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại');
        return;
      }

      setMessages(initialMessages);
      setCurrentChatId(chat.id);
      setInputMessage('');
      closeMenu();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleInputFocus = () => {
    // Scroll đến cuối với animation mượt
    setTimeout(() => {
      // Sử dụng animation với duration cao hơn cho smoothness
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 150);

    // Thêm hệ thống hai bước để đảm bảo scroll hoàn chỉnh
    // - Bước 1: Scroll với animation (đã thêm ở trên)
    // - Bước 2: Kiểm tra lại và scroll thêm lần nữa nếu cần
    setTimeout(() => {
      if (Platform.OS === 'ios') {
        // iOS thường xử lý animation mượt hơn
        scrollViewRef.current?.scrollToEnd({ animated: true });
      } else {
        // Android đôi khi cần thêm một lần scroll nữa
        scrollViewRef.current?.scrollToEnd({ animated: true });

        // Thêm một lần cuối để đảm bảo
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        }, 50);
      }
    }, 250);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* <View style={styles.header}>
        <Text style={styles.headerSubtitle}>
          Hỏi đáp trực tiếp với trợ lý AI
        </Text>
      </View> */}

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="normal"
      >
        {messages.map((message) => (
          message.id === 'loading'
            ? <ChatMessage key={message.id} message={{...message, text: <BlinkingDots />}} />
            : <ChatMessage key={message.id} message={message} />
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
              onPress={() => {
                if (!isBotReplying) setInputMessage(reply.text);
              }}
              disabled={isBotReplying}
            />
          ))}
        </ScrollView>
      </View>

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <View style={styles.leftButtonsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
            <Menu size={20} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleAddImage}>
            <ImagePlus size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nhập câu hỏi..."
          value={inputMessage}
          onChangeText={setInputMessage}
          onFocus={handleInputFocus}
          multiline
          editable={!isBotReplying}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputMessage.trim() || isBotReplying) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputMessage.trim() || isBotReplying}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {/* Error message below input */}
      {errorMessage && (
        <View style={{paddingHorizontal: 16, paddingBottom: 8}}>
          <Text style={{color: '#EF4444', fontSize: 13}}>{errorMessage}</Text>
        </View>
      )}

      {/* Slide Menu */}
      {isMenuOpen && (
        <TouchableWithoutFeedback
          onPress={() => {
            closeMenu();
            setShowDeleteMenu(null); // Đóng menu xóa khi đóng slide menu
          }}
        >
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.slideMenu,
                  { transform: [{ translateX: slideAnimation }] },
                ]}
              >
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>Lịch sử chat</Text>
                  <TouchableOpacity onPress={closeMenu}>
                    <X size={24} color={Colors.text} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.newChatButton}
                  onPress={handleNewChat}
                >
                  <Plus size={20} color={Colors.primary} />
                  <Text style={styles.newChatText}>Tạo đoạn chat mới</Text>
                </TouchableOpacity>

                <ScrollView style={styles.historyList}>
                  {chatHistory.map((chat) => (
                    <View key={chat.id} style={styles.historyItemContainer}>
                      <TouchableOpacity
                        style={[
                          styles.historyItem,
                          currentChatId === chat.id && styles.activeHistoryItem,
                        ]}
                        onPress={() => loadChatHistory(chat)}
                      >
                        <View style={styles.historyItemContent}>
                          <View style={styles.historyItemHeader}>
                            <MessageSquare size={16} color={Colors.primary} />
                            <Text style={styles.historyTitle} numberOfLines={1}>
                              {chat.title}
                            </Text>
                          </View>
                          <Text
                            style={styles.historyLastMessage}
                            numberOfLines={1}
                          >
                            {chat.lastMessage}
                          </Text>
                          <Text style={styles.historyTime}>
                            {formatTime(chat.timestamp)}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.moreButton}
                          onPress={(e) => {
                            e.stopPropagation(); // Ngăn trigger onPress của historyItem
                            toggleDeleteMenu(chat.id);
                          }}
                        >
                          <MoreVertical size={16} color={Colors.textLight} />
                        </TouchableOpacity>
                      </TouchableOpacity>

                      {/* Delete Menu */}
                      {showDeleteMenu === chat.id && (
                        <View style={styles.deleteMenuContainer}>
                          <TouchableOpacity
                            style={styles.deleteMenuItem}
                            onPress={() => handleDeleteChat(chat.id)}
                          >
                            <Trash2 size={16} color="#EF4444" />
                            <Text style={styles.deleteMenuText}>
                              Xóa đoạn chat
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                  {chatHistory.length === 0 && (
                    <Text style={styles.emptyHistory}>
                      Chưa có lịch sử chat
                    </Text>
                  )}
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
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
  leftButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  slideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.8,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
  },
  newChatText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  historyList: {
    flex: 1,
    padding: 16,
  },
  historyItemContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeHistoryItem: {
    backgroundColor: '#E3F2FD',
    borderColor: Colors.primary,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  historyLastMessage: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 11,
    color: Colors.textLight,
    alignSelf: 'flex-end',
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteMenuContainer: {
    position: 'absolute',
    top: 0,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  deleteMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    minWidth: 140,
  },
  deleteMenuText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  emptyHistory: {
    textAlign: 'center',
    color: Colors.textLight,
    fontStyle: 'italic',
    marginTop: 50,
  },
});

// Component dấu ... nhấp nháy
function BlinkingDots() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, []);
  return <Text style={{fontSize: 18, color: Colors.textLight}}>{visible ? '...' : ''}</Text>;
}
