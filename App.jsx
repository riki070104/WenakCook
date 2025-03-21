import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import RecipeModal from "./src/components/RecipeModal";

const screenWidth = Dimensions.get("window").width; // Lebar layar penuh

const recipes = [
  { id: 1, name: "Rawon", image: require("./src/assets/images/Rawon.jpg"), description: "Sup daging khas Jawa Timur dengan kuah hitam dari kluwek." },
  { id: 2, name: "Tahu Telur", image: require("./src/assets/images/TahuTelur.jpg"), description: "Tahu goreng dan telur dadar, disajikan dengan saus kacang." },
  { id: 3, name: "Rujak Cingur", image: require("./src/assets/images/RujakCingur.jpg"), description: "Rujak khas Surabaya dengan cingur (hidung sapi) dan bumbu petis." },
  { id: 4, name: "Bakso Malang", image: require("./src/assets/images/BaksoMalang.jpeg"), description: "Bakso dengan tahu, siomay, dan kuah kaldu khas Malang." },
  { id: 5, name: "Lontong Balap", image: require("./src/assets/images/LontongBalap.jpg"), description: "Lontong, tahu, tauge, lentho, dan kuah gurih khas Surabaya." },
];

const App = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchText, setSearchText] = useState("");

  const filteredRecipes = recipes.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>🍽️ WenakCook</Text>
      <Text style={styles.subtitle}>Resep Makanan Khas Jawa Timur</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Cari makanan..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Scrollable View dengan Scrollbar */}
      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true} // Selalu tampilkan scrollbar
          keyboardShouldPersistTaps="handled" // Agar bisa scroll dengan mouse
        >
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recipeItem}
                onPress={() => setSelectedRecipe(item)}
              >
                <Image source={item.image} style={styles.recipeImage} />
                <Text style={styles.recipeText}>{item.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.errorText}>Makanan tidak ditemukan.</Text>
          )}
        </ScrollView>
      </View>

      {/* Modal Detail Makanan */}
      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  searchBar: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
    width: "100%", // Sesuaikan lebar agar scrollbar pas
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  recipeItem: {
    width: screenWidth * 0.85,
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  recipeText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    padding: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default App;
