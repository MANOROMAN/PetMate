import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../../services/firebaseConfig';
import { logout } from '../../../store/authSlice';
import { setUserPets } from '../../../store/petSlice';

// Örnek veri
const DUMMY_USER_PETS = [
  {
    id: '1',
    name: 'Boncuk',
    type: 'Kedi',
    breed: 'Van Kedisi',
    age: 2,
    image: 'https://via.placeholder.com/300',
    description: 'Oyuncu ve sevecen bir kedi.'
  }
];

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const userPets = useSelector(state => state.pets.userPets);

  useEffect(() => {
    // Gerçek uygulamada API'den alınacak
    setLoading(true);
    setTimeout(() => {
      dispatch(setUserPets(DUMMY_USER_PETS));
      setLoading(false);
    }, 1000);
  }, [dispatch]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigation.replace('Login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleAddPet = () => {
    navigation.navigate('ProfileCreate');
  };

  const handleEditPet = (pet) => {
    navigation.navigate('ProfileCreate', { pet: pet, edit: true });
  };

  const handleDeletePet = (petId) => {
    Alert.alert(
      'Profil Silme',
      'Bu evcil hayvan profilini silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            // Silme işlemi burada yapılacak
            console.log(`Silinen pet ID: ${petId}`);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profilim</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Kullanıcı Bilgileri */}
        <View style={styles.userInfoContainer}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitials}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'kullanici@example.com'}</Text>
            <Text style={styles.userType}>
              {user?.userType === 'petOwner' ? 'Hayvan Sahibi' : 'Veteriner'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Evcil Hayvanlar Başlık */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Evcil Hayvanlarım</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddPet}
          >
            <Text style={styles.addButtonText}>+ Yeni Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Evcil Hayvan Listesi */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : userPets.length > 0 ? (
          userPets.map(pet => (
            <View key={pet.id} style={styles.petCard}>
              <Image 
                source={{ uri: pet.image }} 
                style={styles.petImage} 
              />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.type} - {pet.breed}</Text>
                <Text style={styles.petAge}>{pet.age} yaş</Text>
              </View>
              <View style={styles.petActions}>
                <TouchableOpacity 
                  style={[styles.petActionButton, styles.editPetButton]}
                  onPress={() => handleEditPet(pet)}
                >
                  <Text style={styles.petActionButtonText}>Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.petActionButton, styles.deletePetButton]}
                  onPress={() => handleDeletePet(pet.id)}
                >
                  <Text style={[styles.petActionButtonText, {color: '#FF6347'}]}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyPetsContainer}>
            <Text style={styles.emptyPetsText}>Henüz bir evcil hayvan profili oluşturmadınız</Text>
            <TouchableOpacity 
              style={styles.createPetButton}
              onPress={handleAddPet}
            >
              <Text style={styles.createPetButtonText}>Profil Oluştur</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  signOutText: {
    color: '#FF6347',
    fontWeight: 'bold'
  },
  content: {
    padding: 20
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center'
  },
  userInitials: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  userDetails: {
    flex: 1,
    marginLeft: 15
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  userType: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 2
  },
  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 5
  },
  editButtonText: {
    color: '#4CAF50'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  addButton: {
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  addButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 10,
    color: '#666'
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  petImage: {
    width: 100,
    height: 100
  },
  petInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  petAge: {
    fontSize: 14,
    color: '#333',
    marginTop: 2
  },
  petActions: {
    justifyContent: 'center',
    padding: 10
  },
  petActionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5
  },
  editPetButton: {
    backgroundColor: '#E8F5E9',
  },
  deletePetButton: {
    backgroundColor: '#FFF3F0',
  },
  petActionButtonText