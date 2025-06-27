import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_KEY } from '@/components/api/authService';

export default function useCurrentUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem(USER_KEY);
      if (userData) setUser(JSON.parse(userData));
      else setUser(null);
    };
    fetchUser();
  }, []);

  return [user, setUser] as const;
} 