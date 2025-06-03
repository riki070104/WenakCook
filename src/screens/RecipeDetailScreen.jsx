// src/screens/RecipeDetailScreen.jsx
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert, // Import Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// Ganti nama getRecipeById menjadi getRecipeByIdAPI agar konsisten
import { getRecipeByIdAPI, deleteRecipeAPI } from '../services/API';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipeId, onRecipeUpdatedInList, onRecipeDeletedInList } = route.params || {}; // Ambil callback jika ada
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchRecipe = async () => {
    if (!recipeId) {
      setError('ID resep tidak tersedia.');
      setRecipe(null); // Pastikan recipe null jika tidak ada ID
      return;
    }
    try {
      setError(null); // Reset error
      const data = await getRecipeByIdAPI(recipeId); // Gunakan nama fungsi API yang baru
      setRecipe(data);
    } catch (err) {
      console.error("Error fetching recipe details:", err);
      setError('Gagal memuat detail resep.');
      setRecipe(null); // Set recipe null jika gagal fetch
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  // Untuk menutup menu ketika navigasi berubah atau interaksi lain
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setMenuVisible(false);
    });
    return unsubscribe;
  }, [navigation]);


  useLayoutEffect(() => {
    if (recipe) { // Hanya setel header jika ada resep
      navigation.setOptions({
        title: recipe.name || 'Detail Resep', // Set judul header
        headerRight: () => (
          <TouchableOpacity
            onPress={() => setMenuVisible(prev => !prev)} // Toggle menu
            style={{ marginRight: 15 }}
          >
            <Icon name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({ // Default title jika resep belum load
        title: 'Detail Resep',
        headerRight: undefined, // Sembunyikan menu jika tidak ada resep
      });
    }
  }, [navigation, menuVisible, recipe]);

  const handleDelete = async () => {
    setMenuVisible(false);
    Alert.alert(
      "Hapus Resep",
      `Anda yakin ingin menghapus "${recipe?.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipeAPI(recipeId);
              Alert.alert('Sukses', 'Resep berhasil dihapus.');
              if (onRecipeDeletedInList) { // Callback untuk update list di App.js
                onRecipeDeletedInList(recipeId);
              }
              navigation.goBack();
            } catch (deleteError) {
              console.error("Error deleting recipe:", deleteError);
              Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus resep.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setMenuVisible(false);
    if (recipe) {
      navigation.navigate('RecipeForm', { // Navigasi ke screen RecipeForm global
        recipe: recipe, // Kirim data resep saat ini
        isEdit: true,   // Tandai sebagai mode edit
        onFormSubmitSuccess: (updatedRecipeData) => {
          setRecipe(updatedRecipeData); // Update state di RecipeDetailScreen
          if (onRecipeUpdatedInList) { // Callback untuk update list di App.js
            onRecipeUpdatedInList(updatedRecipeData);
          }
          Alert.alert("Info", "Resep telah diperbarui di halaman detail ini.");
        }
      });
    }
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchRecipe} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!recipe) { // Tampilkan loading atau null jika recipe belum ada
    return (
      <View style={styles.center}>
        <Text>Memuat data resep...</Text>
      </View>
    );
  }

  // Destructure setelah cek recipe ada
  const { image, name, shortDescription, ingredients, steps } = recipe;

  return (
    <TouchableWithoutFeedback onPress={() => menuVisible && setMenuVisible(false)}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {image && image.uri && ( // Pastikan image dan image.uri ada
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          <Text style={styles.title}>{name || 'Judul resep tidak tersedia'}</Text>
          <Text style={styles.description}>{shortDescription || 'Deskripsi tidak tersedia.'}</Text>

          <Text style={styles.sectionTitle}>Bahan-bahan:</Text>
          {ingredients?.length > 0 ? (
            ingredients.map((item, index) => (
              <Text key={index} style={styles.listItem}>
                • {item}
              </Text>
            ))
          ) : (
            <Text style={styles.listItem}>Tidak ada data bahan.</Text>
          )}

          <Text style={styles.sectionTitle}>Langkah-langkah:</Text>
          {steps?.length > 0 ? (
            steps.map((item, index) => (
              <Text key={index} style={styles.listItem}>
                {index + 1}. {item}
              </Text>
            ))
          ) : (
            <Text style={styles.listItem}>Tidak ada data langkah.</Text>
          )}
        </ScrollView>

        {menuVisible && (
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Text style={[styles.menuText, { color: 'red' }]}>Hapus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
              <Text style={styles.menuText}>Batal</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles tetap sama, tambahkan retryButton style
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  image: { width: '100%', height: 250, borderRadius: 10, marginBottom: 15 }, // Tinggikan gambar
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, color: '#333' }, // Besarkan title
  description: { fontSize: 16, color: '#555', marginBottom: 20, lineHeight: 24 }, // Tambah lineHeight
  sectionTitle: {
    fontSize: 20, // Besarkan section title
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12, // Sedikit lebih banyak margin bawah
    color: '#f57c00',
  },
  listItem: { fontSize: 16, marginBottom: 8, color: '#333', lineHeight: 22 }, // Tambah lineHeight
  errorText: { fontSize: 16, textAlign: 'center', marginTop: 40, color: 'red' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }, // Tambah padding
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 0 : 5, // Sesuaikan posisi top untuk header
    right: 15,
    backgroundColor: 'white',
    borderRadius: 8, // Bulatkan sudut lebih
    elevation: 8, // Tingkatkan elevasi
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8, // Tingkatkan radius bayangan
    shadowOffset: { width: 0, height: 4 }, // Sesuaikan offset bayangan
    zIndex: 1000,
    width: 160, // Lebarkan sedikit
  },
  menuItem: {
    paddingVertical: 14, // Tambah padding vertikal
    paddingHorizontal: 18, // Tambah padding horizontal
  },
  menuItemBorderless: { // Untuk item terakhir tanpa border
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#f57c00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecipeDetailScreen;