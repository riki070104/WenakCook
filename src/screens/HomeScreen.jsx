// src/screens/HomeScreen.jsx
import React, {useState, useMemo, useCallback} from 'react';
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
  RefreshControl, // Tambahkan RefreshControl
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const defaultRecipeImageFromApp = require('../assets/images/Rawon.jpg');
const screenWidth = Dimensions.get('window').width;

const FeaturedRecipeCard = ({item, onPress}) => {
  const imageSource =
    item.image && item.image.uri
      ? {uri: item.image.uri}
      : defaultRecipeImageFromApp;

  return (
    <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
      <Image source={imageSource} style={styles.featuredImage} />
      <View style={styles.featuredTextContainer}>
        <Text
          style={styles.featuredName}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.name || 'Nama Resep'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({recipes: recipesFromApp, onRefreshRequest}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (onRefreshRequest) {
      await onRefreshRequest();
    }
    setIsRefreshing(false);
  }, [onRefreshRequest]);

  const filteredRecipes = useMemo(() => {
    let R = Array.isArray(recipesFromApp) ? recipesFromApp : [];
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      R = R.filter(
        item =>
          item &&
          item.name &&
          item.name.toLowerCase().includes(lowerSearchText),
      );
    }
    return R;
  }, [recipesFromApp, searchText]);

  const recipesToShowInFeatured =
    filteredRecipes.length > 0
      ? filteredRecipes
      : searchText
      ? []
      : recipesFromApp;
  const featuredRecipes = Array.isArray(recipesToShowInFeatured)
    ? recipesToShowInFeatured.slice(0, 5)
    : [];

  const handleNavigateToLibrary = () => {
    navigation.navigate('LibraryTab', {screen: 'RecipeLibraryMain'});
  };

  const handleRecipePress = recipeId => {
    if (recipeId) {
      navigation.navigate('RecipeDetail', {recipeId});
    } else {
      Alert.alert('Error', 'ID resep tidak valid untuk dibuka.');
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      refreshControl={
        // Tambahkan RefreshControl di sini
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#f57c00']} // Warna spinner refresh
        />
      }>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>WenakCook</Text>
        <Text style={styles.headerSubtitle}>Mau masak apa hari ini, Bang?</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Cari resep masakan..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
        clearButtonMode="while-editing"
      />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {searchText
            ? `Hasil Pencarian (${filteredRecipes.length})`
            : 'Resep Pilihan ✨'}
        </Text>
        {featuredRecipes.length > 0 ? (
          <FlatList
            horizontal
            data={featuredRecipes}
            renderItem={({item}) => (
              <FeaturedRecipeCard
                item={item}
                onPress={() => handleRecipePress(item.id)}
              />
            )}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredListContainer}
          />
        ) : (
          <Text style={styles.noFeaturedText}>
            {searchText
              ? 'Resep tidak ditemukan.'
              : recipesFromApp && recipesFromApp.length > 0
              ? 'Tidak ada resep pilihan yang cocok.'
              : 'Belum ada resep.'}
          </Text>
        )}
      </View>

      {(filteredRecipes.length > featuredRecipes.length &&
        filteredRecipes.length > 0) ||
      (!searchText &&
        recipesFromApp &&
        recipesFromApp.length > featuredRecipes.length) ? (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={handleNavigateToLibrary}>
          <Text style={styles.seeAllButtonText}>
            Lihat Semua Resep ({recipesFromApp.length})
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {flex: 1, backgroundColor: '#FFF8F0'}, // Warna dasar
  container: {paddingBottom: 30},
  headerContainer: {
    backgroundColor: '#b35400',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFDAB9',
    textAlign: 'center',
    marginTop: 4,
  }, // Warna peach agar kontras
  searchBar: {
    width: '90%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0DACC',
    marginTop: 15,
    marginBottom: 20,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionContainer: {marginBottom: 20, paddingHorizontal: 15},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b35400',
    marginBottom: 15,
  },
  featuredListContainer: {paddingVertical: 5},
  featuredCard: {
    width: screenWidth * 0.58,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 3,
    overflow: 'visible',
  },
  featuredImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  featuredTextContainer: {padding: 12, minHeight: 65, justifyContent: 'center'},
  featuredName: {fontSize: 16, fontWeight: '600', color: '#444'}, // Font lebih besar
  noFeaturedText: {
    textAlign: 'center',
    color: '#757575',
    marginTop: 20,
    marginBottom: 20,
    fontStyle: 'italic',
    fontSize: 15,
  },
  seeAllButton: {
    backgroundColor: '#ff7f50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  seeAllButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

export default HomeScreen;
