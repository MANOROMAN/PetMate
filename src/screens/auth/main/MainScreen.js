import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../../services/firebaseConfig';
import { logout } from '../../../store/authSlice';
import { setUserPets, setRecommendedPets } from '../../../store/petSlice';
import PetCard from '../../../components/PetCard';

// Örnek veri
const DUMMY_PETS = [
  {
    id: '1',
    name: 'Max',
    type: 'Köpek',
    breed: 'Golden Retriever',
    age: 3,
    image: 'https://via.placeholder.com/300',
    description: 'Enerjik ve oyuncu bir köpek. Diğer hayvanlarla çok iyi anlaşır.'
  },
  {
    id: '2',
    name: 'Luna',
    type: 'Kedi',
    breed: 'British Shorthair',
    age: 2,
    image: 'https://via.placeholder.com/300',
    description: 'Sakin ve tatlı bir kedi. Kucakta oturmayı sever.'
  },
  {
    id: '3',
    name: 'Buddy',
    type: 'Köpek',
    breed: 'Labrador',
    age: 1,
    image: 'https://via.placeholder.com/300',
    description: 'Çok enerjik ve oyuncu. Koşmayı ve top oynamayı çok sever.'
  }
];

const MainScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    // Burada gerçek uygulamada API'den verileri çekeceğiz
    // Şimdilik dummy veri kullanıyoruz
    setLoading(true);
    setTimeout(() => {
      dispatch(setRecommendedPets(DUMMY_PETS));
      setLoading(false);
    }, 1000);
  }, [dispatch]);

  const recommendedPets = useSelector(state => state.pets.recommendedPets);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigation.replace('Login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const handleLike = (petId) => {
    // Like işlemlerini gerçekleştir
    console.log(`${petId} beğenildi`);
    if (currentPetIndex < recommendedPets.length - 1) {
      setCurrentPetIndex(currentPetIndex + 1);
    } else {
      // Tüm öneriler bitti
      console.log('Tüm öneriler incelendi');
    }
  };

  const handleDislike = (petId) => {
    // Dislike işlemlerini gerçekleştir
    console.log(`${petId} beğenilmedi`);
    if (currentPetIndex < recommendedPets.length - 1) {
      setCurrentPetIndex(currentPetIndex + 1);
    } else {
      // Tüm öneriler bitti
      console.log('Tüm öneriler incelendi');
    }
  };

  const handleAddPet = () => {
    navigation.navigate('ProfileCreate');
  };

  const renderCurrentPet = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Evcil hayvanlar yükleniyor...</Text>
        </View>
      );
    }

    if (recommendedPets.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz eşleşme önerisi bulunmuyor</Text>
          <TouchableOpacity 
            style={styles.addPetButton}
            onPress={handleAddPet}
          >
            <Text style={styles.addPetButtonText}>Profil Oluştur</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentPetIndex >= recommendedPets.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tüm önerileri incelediniz</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => setCurrentPetIndex(0)}
          >
            <Text style={styles.refreshButtonText}>Yenile</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const currentPet = recommendedPets[currentPetIndex];
    
    return (
      <View style={styles.cardContainer}>
        <PetCard pet={currentPet} />
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.dislikeButton]}
            onPress={() => handleDislike(currentPet.id)}
          >
            <Text style={styles.actionButtonText}>✕</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => handleLike(currentPet.id)}
          >
            <Text style={styles.actionButtonText}>♥</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PetMate</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderCurrentPet()}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.footerButtonText}>Profil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('Match')}
        >
          <Text style={styles.footerButtonText}>Eşleşmeler</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingContainer: {
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20
  },
  addPetButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  addPetButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  dislikeButton: {
    backgroundColor: '#FF6347'
  },
  likeButton: {
    backgroundColor: '#4CAF50'
  },
  actionButtonText: {
    fontSize: 24,
    color: 'white'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white'
  },
  footerButton: {
    padding: 10
  },
  footerButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  }
});

export default MainScreen;