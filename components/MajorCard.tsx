import { StyleSheet, Text, View } from 'react-native';
import { BookOpen, Code, Stethoscope, Briefcase, Palette, Users } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type MajorCardProps = {
  title: string;
  description: string;
  subjects: string[];
  icon: string;
};

export function MajorCard({ title, description, subjects, icon }: MajorCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'code':
        return <Code size={24} color="#FFFFFF" />;
      case 'stethoscope':
        return <Stethoscope size={24} color="#FFFFFF" />;
      case 'briefcase':
        return <Briefcase size={24} color="#FFFFFF" />;
      case 'palette':
        return <Palette size={24} color="#FFFFFF" />;
      case 'users':
        return <Users size={24} color="#FFFFFF" />;
      default:
        return <BookOpen size={24} color="#FFFFFF" />;
    }
  };

  const getIconBackgroundColor = () => {
    switch (icon) {
      case 'code':
        return '#4F46E5'; // tech - indigo
      case 'stethoscope':
        return '#EF4444'; // medical - red
      case 'briefcase':
        return '#F59E0B'; // business - amber
      case 'palette':
        return '#8B5CF6'; // art - purple
      case 'users':
        return '#10B981'; // social - emerald
      default:
        return Colors.primary;
    }
  };

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
        {getIcon()}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.subjectsContainer}>
          <Text style={styles.subjectsLabel}>Môn học chính:</Text>
          <View style={styles.subjectsList}>
            {subjects.map((subject, index) => (
              <View key={index} style={styles.subjectItem}>
                <Text style={styles.subjectText}>{subject}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  iconContainer: {
    padding: 16,
    alignItems: 'flex-start',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  subjectsContainer: {
    marginTop: 4,
  },
  subjectsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  subjectsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectItem: {
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  subjectText: {
    fontSize: 12,
    color: Colors.text,
  },
});