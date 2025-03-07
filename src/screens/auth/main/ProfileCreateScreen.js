import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image,
  Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfileCreateScreen = ({ navigation }) => {
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petDescription, setPetDescription] = useState('');
  const [petImage, setPetImage] = useState(null);

  const petTypes = ['Köpek', 'Kedi', 'Kuş', 'Hamster', 'Diğer'];

  const pickImage = async () => {
    // İzin kontrolü
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Üzgünüz, resim seçmek için izne ihtiyacımız var!');
        return;
      }
    }

    // Resim seçme
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPetImage(result.assets[0].uri);
    }
  };

  const handleCreateProfile = () => {
    // Gerekli alan kontrolü
    if (!petName || !petType || !petBreed || !petAge) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    // Profil oluşturma işlemi
    const newPetProfile = {
      name: petName,
      type: petType,
      breed: petBreed,
      age: parseInt(petAge),
      description: petDescription,
      image: petImage
    };

    // Burada profili kaydetme veya state'e ekleme işlemi yapılacak
    console.log('Yeni Profil:', newPetProfile);

    // Profil oluşturulduktan sonra ana ekrana dön
    navigation.navigate('Main');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Evcil Hayvan Profili Oluştur</Text>

      {/* Profil Resmi Seçimi */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {petImage ? (
          <Image source={{ uri: petImage }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Profil Resmi Seç</Text>
        )}
      </TouchableOpacity>

      {/* İsim Girişi */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Evcil Hayvan Adı</Text>
        <TextInput
          style={styles.input}
          value={petName}
          onChangeText={setPetName}
          placeholder="Örn: Boncuk"
        />
      </View>

      {/* Hayvan Türü Seçimi */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hayvan Türü</Text>
        <View style={styles.typeButtonContainer}>
          {petTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                petType === type && styles.selectedTypeButton
              ]}
              onPress={() => setPetType(type)}
            >
              <Text 
                style={[
                  styles.typeButtonText,
                  petType === type && styles.selectedTypeButtonText
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Irk Girişi */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Irk</Text>
        <TextInput
          style={styles.input}
          value={petBreed}
          onChangeText={setPetBreed}
          placeholder="Örn: Golden Retriever"
        />
      </View>

      {/* Yaş Girişi */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Yaş</Text>
        <TextInput
          style={styles.input}
          value={petAge}
          onChangeText={setPetAge}
          placeholder="Örn: 2"
          keyboardType="numeric"
        />
      </View>

      {/* Açıklama Girişi */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={petDescription}
          onChangeText={setPetDescription}
          placeholder="Örn: Parkta oynamayı sever"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Profil Oluşturma Butonu */}
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={handleCreateProfile}
      >
        <Text style={styles.createButtonText}>Profil Oluştur</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5FCFF',
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  imagePicker: {
    width: 150,
    height: 150,
    backgroundColor: '#E1E1E1',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75
  },
  imagePickerText: {
    color: '#888'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white'
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  typeButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  typeButton: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    padding: 10,
    borderRadius: 8
  },
  selectedTypeButton: {
    backgroundColor: '#4CAF50'
  },
  typeButtonText: {
    color: '#4CAF50'
  },
  selectedTypeButtonText: {
    color: 'white'
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default ProfileCreateScreen;

