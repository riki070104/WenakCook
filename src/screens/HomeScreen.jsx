// src/screens/HomeScreen.jsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
// RecipeModal gak dipake lagi kalo detailnya udah pindah ke RecipeDetailScreen
// import RecipeModal from "../components/RecipeModal";

const screenWidth = Dimensions.get("window").width;

// Kategori resep (opsional, bisa diaktifin nanti)
// const recipeCategories = [
//   { id: 'all', name: 'Semua' },
//   { id: 'main', name: 'Utama' },
//   { id: 'snack', name: 'Camilan' },
//   { id: 'drink', name: 'Minuman' },
// ];

const FeaturedRecipeCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
    <Image source={item.image} style={styles.featuredImage} />
    <View style={styles.featuredTextContainer}>
      <Text style={styles.featuredName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation, recipes }) => { // recipes dioper dari App.jsx
  const [searchText, setSearchText] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState('all'); // Kalo kategori mau dipake

  // Filter resep berdasarkan pencarian (dan kategori kalo diaktifin)
  const filteredRecipes = useMemo(() => {
    let R = recipes; // Ambil semua resep dari props

    // Kalo mau pake filter kategori, uncomment dan sesuaikan bagian ini:
    // if (selectedCategory !== 'all' && R) {
    //   R = R.filter(recipe => recipe.category === selectedCategory); // Asumsi ada recipe.category
    // }

    if (searchText && R) {
      const lowerSearchText = searchText.toLowerCase();
      R = R.filter(item =>
        item.name.toLowerCase().includes(lowerSearchText)
      );
    }
    return R || []; // Pastiin selalu array, meskipun R jadi null/undefined
  }, [recipes, searchText /*, selectedCategory */]);

  // Ambil beberapa resep buat ditampilin di "Resep Pilihan"
  // Kalo ada hasil filter, pake hasil filter. Kalo gak, pake resep awal.
  const recipesToShowInFeatured = filteredRecipes.length > 0 ? filteredRecipes : (searchText ? [] : recipes);
  const featuredRecipes = recipesToShowInFeatured.slice(0, 5); // Tampilkan sampai 5 resep pilihan

  const handleNavigateToLibrary = () => {
    navigation.navigate('LibraryTab', { screen: 'RecipeLibraryMain' });
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetail', { recipe: recipe });
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>WenakCook</Text>
        <Text style={styles.headerSubtitle}>Mau masak apa hari ini, Bang?</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Cari resep masakan..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={(text) => setSearchText(text)} // Langsung update searchText
        clearButtonMode="while-editing" // Tombol clear (iOS)
      />

      {/* Bagian Kategori (Opsional, bisa di-uncomment dan disesuaikan) */}
      {/* <View style={styles.categoriesContainer}> ... </View> */}

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {searchText ? `Hasil Pencarian (${filteredRecipes.length})` : "Resep Pilihan Untukmu ✨"}
        </Text>
        {featuredRecipes.length > 0 ? (
          <FlatList
            horizontal
            data={featuredRecipes}
            renderItem={({ item }) => (
              <FeaturedRecipeCard
                item={item}
                onPress={() => handleRecipePress(item)}
              />
            )}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredListContainer}
          />
        ) : (
          <Text style={styles.noFeaturedText}>
            {searchText ? "Resep tidak ditemukan." : "Belum ada resep."}
          </Text>
        )}
      </View>

      {/* Tombol Lihat Semua cuma muncul kalo hasil filter lebih banyak dari yg ditampilin,
          atau kalo gak ada teks pencarian (artinya nampilin semua dari awal) */}
      {(filteredRecipes.length > featuredRecipes.length && filteredRecipes.length > 0) || (!searchText && recipes && recipes.length > featuredRecipes.length) ? (
         <TouchableOpacity style={styles.seeAllButton} onPress={handleNavigateToLibrary}>
            <Text style={styles.seeAllButtonText}>Lihat Semua Resep Lainnya ({filteredRecipes.length})</Text>
         </TouchableOpacity>
      ): null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    paddingBottom: 30,
  },
  headerContainer: {
    backgroundColor: '#f57c00',
    paddingHorizontal: 20,
    paddingTop: 40, // Sesuaikan dengan status bar
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 5
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
  searchBar: {
    width: '90%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    elevation: 3,
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featuredListContainer: {
    paddingVertical: 5, // Kasih sedikit padding vertikal buat card
  },
  featuredCard: {
    width: screenWidth * 0.55, // Lebar card disesuaikan
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: 'hidden', // Biar shadow gak aneh di Android
  },
  featuredImage: {
    width: "100%",
    height: 110, // Tinggi gambar di card
    borderTopLeftRadius: 12, // Biar gambar ikut bulet
    borderTopRightRadius: 12,
  },
  featuredTextContainer: {
    padding: 10,
    minHeight: 60, // Biar card sama tinggi kalo nama resep beda panjang
    justifyContent: 'center',
  },
  featuredName: {
    fontSize: 15,
    fontWeight: "600", // Sedikit beda dari judul section
    color: "#444",
  },
  noFeaturedText: {
    textAlign: 'center',
    color: '#6c757d',
    marginTop: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  seeAllButton: {
    backgroundColor: '#6a8caf',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },
  seeAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;