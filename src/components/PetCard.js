import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

const PetCard = ({ pet }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: pet.image }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <View style={styles.nameAgeContainer}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.age}>{pet.age} yaş</Text>
        </View>
        <Text style={styles.breed}>{pet.type} - {pet.breed}</Text>
        <Text style={styles.description}>{pet.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: 300
  },
  infoContainer: {
    padding: 15
  },
  nameAgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  age: {
    fontSize: 18,
    color: '#666'
  },
  breed: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20
  }
});

export default PetCard;