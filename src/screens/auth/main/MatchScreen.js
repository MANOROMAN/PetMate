import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useSelector } from 'react-redux';

// Örnek veri
const DUMMY_MATCHES = [
  {
    id: '1',
    name: 'Max',
    type: 'Köpek',
    breed: 'Golden Retriever',
    age: 3,
    image: 'https://via.placeholder.com/300',
    owner: {
      id: 'owner1',
      name: 'Ahmet Yılmaz',
      contact: 'ahmet@example.com'
    },
    matchDate: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Luna',
    type: 'Kedi',
    breed: 'British Shorthair',
    age: 2,
    image: 'https://via.placeholder.com/300',
    owner: {
      id: 'owner2',
      name: 'Ayşe Kaya',
      contact: 'ayse@example.com'
    },
    matchDate: new Date().toISOString()
  }
];

const MatchScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = () => {
    setLoading(true);
    // Gerçek uygulamada API'den alınacak
    setTimeout(() => {
      setMatches(DUMMY_MATCHES);
      setLoading(false);
    }, 1000);
  };

  const renderMatchItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.matchItem}
        onPress={() => navigation.navigate('MatchDetail', { match: item })}
      >
        <Image source={{ uri: item.image }} style={styles.matchImage} />
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.name}</Text>
          <Text style={styles.matchBreed}>{item.type} - {item.breed}</Text>
          <Text style={styles.matchOwner}>Sahibi: {item.owner.name}</Text>
          <Text style={styles.matchDate}>
            Eşleşme Tarihi: {new Date(item.matchDate).toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz eşleşmeniz bulunmuyor</Text>
        <TouchableOpacity 
          style={styles.emptyButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.emptyButtonText}>Evcil Hayvan Ara</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eşleşmelerim</Text>
        <TouchableOpacity onPress={fetchMatches}>
          <Text style={styles.refreshText}>Yenile</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Eşleşmeler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmptyList}
        />
      )}
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
  refreshText: {
    color: '#2196F3',
    fontWeight: 'bold'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  list: {
    padding: 10
  },
  matchItem: {
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
  matchImage: {
    width: 120,
    height: 120
  },
  matchInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  matchBreed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  matchOwner: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  },
  matchDate: {
    fontSize: 12,
    color: '#999'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default MatchScreen;