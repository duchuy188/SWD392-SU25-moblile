import { StyleSheet, Text, View, Image } from 'react-native';
import Colors from '@/constants/Colors';

type MajorCardProps = {
  name: string;
  department?: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  code?: string;
};

export function MajorCard({ name, department, description, shortDescription, imageUrl, code }: MajorCardProps) {
  return (
    <View style={styles.card}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      )}
      <Text style={styles.title}>{name}</Text>
      {code && <Text style={styles.detailText}>Mã ngành: {code}</Text>}
      {department && <Text style={styles.detailText}>Ngành học: {department}</Text>}
      {(shortDescription || description) && <Text style={styles.detailText}>{shortDescription || description}</Text>}
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
    padding: 16,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
});