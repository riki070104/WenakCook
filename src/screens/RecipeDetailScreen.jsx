// src/screens/RecipeDetailScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text>Resep tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonError}>
          <Text style={styles.backButtonTextError}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
      </View>
      <Image source={recipe.image} style={styles.recipeImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.recipeName}>{recipe.name}</Text>

        {recipe.shortDescription && (
          <>
            <Text style={styles.sectionTitle}>Deskripsi Singkat:</Text>
            <Text style={styles.descriptionText}>{recipe.shortDescription}</Text>
          </>
        )}

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Bahan-bahan:</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={`ingredient-${index}`} style={styles.listItemText}>
                • {ingredient}
              </Text>
            ))}
          </>
        )}

        {recipe.steps && recipe.steps.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Cara Memasak:</Text>
            {recipe.steps.map((step, index) => (
              <Text key={`step-${index}`} style={styles.listItemText}>
                {index + 1}. {step}
              </Text>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    // Dulu position absolute, kita ubah biar normal flow aja
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'transparent', // Bisa juga dikasih warna header
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',
    height: 250, // Tinggi gambar disesuaikan
    resizeMode: 'cover',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  recipeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    // textAlign: 'center', // Kalo mau di tengah
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700', // Lebih tebal
    color: '#f57c00', // Warna tema
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 15,
  },
  listItemText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 6,
    marginLeft: 5, // Kasih indent dikit
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonError: {
    marginTop: 20,
    backgroundColor: '#f57c00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonTextError: {
    color: '#fff',
    fontSize: 16,
  }
});

export default RecipeDetailScreen;