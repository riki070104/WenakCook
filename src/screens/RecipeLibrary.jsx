// src/screens/RecipeLibrary.jsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator, // Tambahkan untuk loading indicator
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Impor useNavigation
import { getAllRecipesAPI } from '../services/API';

const screenWidth = Dimensions.get('window').width;
const defaultPlaceholderImage = 'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=No+Image';

const RecipeLibrary = () => { // Hapus props navigation jika menggunakan hook
  const navigation = useNavigation(); // Gunakan hook untuk akses navigation
  const [recipes, setRecipes] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State untuk initial loading

  // Ambil semua resep dari MockAPI
  const fetchRecipes = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    }
    try {
      const dataFromApi = await getAllRecipesAPI(); // dataFromApi sudah di-map di API.js
      setRecipes(dataFromApi || []); // Pastikan data adalah array
    } catch (error) {
      console.error('Gagal mengambil data resep:', error);
      setRecipes([]); // Set ke array kosong jika gagal
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
      setIsRefreshing(false);
    }
  };

  // Ambil data saat screen difokuskan atau pertama kali load
  useFocusEffect(
    useCallback(() => {
      fetchRecipes(true); // Anggap sebagai initial load saat fokus pertama
      return () => {
        // Bisa tambahkan cleanup jika perlu saat screen tidak fokus
      };
    }, [])
  );

  // Pull-to-refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchRecipes(false); // Bukan initial load
  };

  // Navigasi ke detail resep
  // Pastikan RecipeDetailScreen menerima callbacks dari navigator di App.js
  // Di sini, RecipeLibrary hanya perlu mengirim recipeId.
  // Penanganan callback onRecipeUpdatedInList dan onRecipeDeletedInList
  // sudah diatur di App.js pada RecipeLibraryNavigator.
  const handleRecipePress = (recipeId) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  // Render setiap item resep
  const renderRecipeItem = ({ item }) => {
    // item.image sudah berupa objek { uri: '...' } atau null dari mapApiRecipeToAppFormat
    // item.name juga sudah disesuaikan
    const imageUri = item.image && item.image.uri ? item.image.uri : defaultPlaceholderImage;

    return (
      <TouchableOpacity
        style={styles.recipeItem}
        onPress={() => handleRecipePress(item.id)}
      >
        <Image source={{ uri: imageUri }} style={styles.recipeImage} />
        <View style={styles.recipeTextContainer}>
          {/* Gunakan item.name bukan item.NamaResep */}
          <Text style={styles.recipeName}>{item.name || "Nama Resep Tidak Tersedia"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && recipes.length === 0) {
    return (
      <View style={[styles.outerContainer, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#f57c00" />
        <Text style={{ marginTop: 10, color: '#555' }}>Memuat resep...</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.headerTitle}>Koleksi Resep WenakCook</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#f57c00']}
          />
        }
        ListEmptyComponent={
          !isLoading && ( // Hanya tampilkan jika tidak sedang loading awal
            <View style={styles.centerContainer}>
              <Text style={styles.noItemsText}>
                Belum ada resep di koleksi.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: { // Style untuk memusatkan konten (loading/empty)
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContainer: { // Ganti nama dari 'container' untuk menghindari konflik
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    // alignItems: 'center', // Dihapus agar item bisa full-width jika diinginkan
  },
  recipeItem: {
    width: screenWidth * 0.92, // Sedikit lebih lebar
    alignSelf: 'center', // Untuk memusatkan item jika width tidak 100%
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 18, // Tambah margin
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4, // Perhalus shadow
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    backgroundColor: '#e0e0e0', // Warna placeholder saat gambar load
  },
  recipeTextContainer: {
    padding: 14, // Sedikit lebih banyak padding
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600', // Sedikit lebih ringan dari 'bold'
    color: '#333',
  },
  noItemsText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default RecipeLibrary;