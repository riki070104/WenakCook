// src/screens/RecipeLibrary.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
// HAPUS impor RecipeModal
// import RecipeModal from "../components/RecipeModal";

const screenWidth = Dimensions.get("window").width;

const RecipeLibrary = ({ recipes, navigation }) => {
  // HAPUS state selectedRecipe
  // const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fungsi baru buat navigasi ke RecipeDetailScreen
  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetail', { recipe: recipe }); // Kirim data resep
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.headerTitle}>Koleksi Resep WenakCook</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {recipes && recipes.length > 0 ? (
          recipes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recipeItem}
              onPress={() => handleRecipePress(item)} // <-- GANTI AKSI onPress
            >
              <Image source={item.image} style={styles.recipeImage} />
              <View style={styles.recipeTextContainer}>
                <Text style={styles.recipeName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noItemsText}>Belum ada resep di koleksi.</Text>
        )}
      </ScrollView>

      {/* HAPUS RecipeModal dari sini */}
      {/* {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )} */}
    </View>
  );
};

// ... Styles (tetap sama dari versi sebelumnya) ...
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  recipeItem: {
    width: screenWidth * 0.9,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  recipeTextContainer: {
    padding: 12,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  noItemsText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 50,
  },
});

export default RecipeLibrary;