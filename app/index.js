import React from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ana Ekran</Text>
      <Link href="./screens/ProfileCreateScreen">Profil Oluştur Ekranına Git</Link>
    </View>
  );
};

export default HomeScreen;