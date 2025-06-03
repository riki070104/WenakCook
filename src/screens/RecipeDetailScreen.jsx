// src/screens/RecipeDetailScreen.jsx
import React, {useEffect, useState, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  getRecipeByIdFirestore,
  deleteRecipeFirestore,
} from '../services/Firebase';

const defaultPlaceholderImage =
  'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=No+Image';

const RecipeDetailScreen = ({route, navigation}) => {
  const {recipeId, onRecipeUpdatedInList, onRecipeDeletedInList} =
    route.params || {};
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchRecipeDetails = useCallback(async () => {
    if (!recipeId) {
      setError('ID resep tidak valid.');
      setIsLoading(false);
      setRecipe(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const dataFromFirestore = await getRecipeByIdFirestore(recipeId);
      if (dataFromFirestore) {
        setRecipe(dataFromFirestore);
      } else {
        setError('Resep tidak ditemukan.');
        setRecipe(null);
      }
    } catch (err) {
      setError('Gagal memuat detail resep.');
      setRecipe(null);
    } finally {
      setIsLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () =>
      setMenuVisible(false),
    );
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: recipe?.name || 'Detail Resep',
      headerTintColor: '#b35400', // Warna teks header agar konsisten
      headerRight: recipe
        ? () => (
            <TouchableOpacity
              onPress={() => setMenuVisible(prev => !prev)}
              style={{marginRight: 15}}>
              <Icon name="ellipsis-vertical" size={24} color="#b35400" />
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [navigation, menuVisible, recipe]);

  const handleDelete = async () => {
    setMenuVisible(false);
    if (!recipe || !recipe.id) {
      Alert.alert('Error', 'Tidak ada resep untuk dihapus.');
      return;
    }
    Alert.alert(
      'Hapus Resep',
      `Yakin ingin menghapus "${recipe.name}"?`,
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // Jika Abang punya endpoint untuk hapus gambar dari backend eksternal, panggil di sini.
              // Contoh: if (recipe.image?.uri) await deleteExternalImageAPI(recipe.image.uri);
              await deleteRecipeFirestore(recipe.id);
              Alert.alert('Sukses', `Resep "${recipe.name}" dihapus.`);
              if (onRecipeDeletedInList) onRecipeDeletedInList(recipe.id);
              navigation.goBack();
            } catch (deleteError) {
              Alert.alert('Gagal', 'Gagal menghapus resep dari server.');
              setIsLoading(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleEdit = () => {
    setMenuVisible(false);
    if (recipe) {
      navigation.navigate('RecipeForm', {
        // Navigasi ke RecipeForm global
        recipe: recipe,
        isEdit: true,
        onFormSubmitSuccess: updatedRecipe => {
          setRecipe(updatedRecipe); // Update state lokal
          if (onRecipeUpdatedInList) onRecipeUpdatedInList(updatedRecipe); // Update state global
        },
      });
    } else {
      Alert.alert('Error', 'Data resep tidak ada untuk diedit.');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.center, {backgroundColor: '#FFF8F0'}]}>
        <ActivityIndicator size="large" color="#b35400" />
        <Text style={{marginTop: 10, color: '#555'}}>Memuat detail...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={fetchRecipeDetails}
          style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Resep tidak dapat ditemukan.</Text>
      </View>
    );
  }

  const {image, name, shortDescription, ingredients, steps} = recipe;
  const imageUriToDisplay =
    image && image.uri ? image.uri : defaultPlaceholderImage;

  return (
    <ScrollView
      onPress={() => menuVisible && setMenuVisible(false)}>
      <View style={{flex: 1, backgroundColor: '#FFF8F0'}}>
        <ScrollView
          style={styles.containerScroll}
          contentContainerStyle={styles.contentContainerScroll}>
          <Image
            source={{uri: imageUriToDisplay}}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>{name || 'Nama Resep Tidak Ada'}</Text>
          <Text style={styles.description}>
            {shortDescription || 'Deskripsi tidak ada.'}
          </Text>
          <Text style={styles.sectionTitle}>Bahan-bahan:</Text>
          {ingredients?.length > 0 ? (
            ingredients.map((item, index) => {
              if (typeof item === 'string' && item.trim() !== '') {
                // Hanya render jika string dan tidak kosong
                return (
                  <Text key={`ing-${index}`} style={styles.listItem}>
                    • {item}
                  </Text>
                );
              }
              return null; // Abaikan item yang tidak valid
            })
          ) : (
            <Text style={styles.listItem}>Tidak ada data bahan.</Text>
          )}
          <Text style={styles.sectionTitle}>Langkah-langkah:</Text>
          {steps?.length > 0 ? (
            steps.map((item, index) => {
              if (typeof item === 'string' && item.trim() !== '') {
                // Hanya render jika string dan tidak kosong
                return (
                  <Text key={`step-${index}`} style={styles.listItem}>
                    {index + 1}. {item}
                  </Text>
                );
              }
              return null; // Abaikan item yang tidak valid
            })
          ) : (
            <Text style={styles.listItem}>Tidak ada data langkah.</Text>
          )}
          <View style={{height: 70}} /> {/* Spacer untuk bottom menu */}
        </ScrollView>
        {menuVisible && (
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Text style={[styles.menuText, {color: 'red'}]}>Hapus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorderless]}
              onPress={() => setMenuVisible(false)}>
              <Text style={styles.menuText}>Batal</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerScroll: {flex: 1, backgroundColor: '#FFF8F0'},
  contentContainerScroll: {padding: 20, paddingBottom: 80}, // Tambah padding bawah lagi
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
  },
  title: {fontSize: 26, fontWeight: 'bold', marginBottom: 10, color: '#b35400'},
  description: {
    fontSize: 16,
    color: '#5d5d5d',
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 10,
    color: '#f57c00',
  },
  listItem: {fontSize: 16, marginBottom: 7, color: '#444', lineHeight: 23},
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF8F0',
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 5 : 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    zIndex: 1000,
    width: 170,
  },
  menuItem: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  menuItemBorderless: {borderBottomWidth: 0},
  menuText: {fontSize: 16, color: '#333'},
  retryButton: {
    marginTop: 20,
    backgroundColor: '#f57c00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default RecipeDetailScreen;
