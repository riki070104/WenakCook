// src/screens/RecipeLibrary.jsx
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getAllRecipesFirestore} from '../services/Firebase';

const screenWidth = Dimensions.get('window').width;
const defaultPlaceholderImage =
  'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=No+Image';

const RecipeLibrary = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecipesFromFirestore = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const dataFromFirestore = await getAllRecipesFirestore();
      const validRecipes = Array.isArray(dataFromFirestore)
        ? dataFromFirestore.filter(item => item && item.id)
        : [];
      setRecipes(validRecipes);
    } catch (error) {
      console.error('RecipeLibrary: Gagal mengambil resep:', error);
      setRecipes([]);
    } finally {
      if (isInitialLoad) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipesFromFirestore(true);
    }, []),
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchRecipesFromFirestore(false);
  };

  const handleRecipePress = recipeId => {
    navigation.navigate('RecipeDetail', {recipeId});
  };

  const renderRecipeItem = ({item}) => {
    const imageUri =
      item.image && item.image.uri ? item.image.uri : defaultPlaceholderImage;
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.recipeItem}
        onPress={() => handleRecipePress(item.id)}>
        <Image source={{uri: imageUri}} style={styles.recipeImage} />
        <View style={styles.recipeTextContainer}>
          <Text style={styles.recipeName}>
            {item.name || 'Nama Resep Tidak Tersedia'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && recipes.length === 0) {
    return (
      <View style={[styles.outerContainer, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#b35400" />
        <Text style={{marginTop: 10, color: '#555'}}>
          Memuat koleksi resep...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.headerTitle}>Koleksi Resep WenakCook</Text>
      <FlatList
        data={recipes}
        keyExtractor={item => item.id.toString()}
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
          !isLoading && (
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
  outerContainer: {flex: 1, backgroundColor: '#FFF8F0'},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b35400',
    textAlign: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff0e6',
    borderBottomWidth: 1,
    borderBottomColor: '#E0DACC',
  },
  listContainer: {paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20},
  recipeItem: {
    width: screenWidth * 0.92,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    backgroundColor: '#e0e0e0',
  },
  recipeTextContainer: {padding: 14},
  recipeName: {fontSize: 18, fontWeight: '600', color: '#333'},
  noItemsText: {
    fontSize: 16,
    color: '#757575',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default RecipeLibrary;
