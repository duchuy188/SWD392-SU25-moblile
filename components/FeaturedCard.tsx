import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { GraduationCap, Briefcase, MessageSquare, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type FeaturedCardProps = {
  title: string;
  description: string;
  icon: string;
  route: string;
};

export function FeaturedCard({ title, description, icon, route }: FeaturedCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'graduation-cap':
        return <GraduationCap size={24} color={Colors.primary} />;
      case 'briefcase':
        return <Briefcase size={24} color={Colors.primary} />;
      case 'message-square':
        return <MessageSquare size={24} color={Colors.primary} />;
      default:
        return <GraduationCap size={24} color={Colors.primary} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Link href={route} asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Khám phá</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginRight: 4,
  },
});