// App.js
import React, { useState, useEffect } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, View, Text } from 'react-native';

import HomeScreenComponent from './src/screens/HomeScreen';
import RecipeLibraryComponent from './src/screens/RecipeLibrary.jsx';
import RecipeFormComponent from './src/screens/RecipeForm.jsx';
import ProfileScreenComponent from './src/screens/ProfileScreen.jsx';
import RecipeDetailScreenComponent from './src/screens/RecipeDetailScreen.jsx';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { MenuProvider } from 'react-native-popup-menu';
import { getAllRecipesAPI as fetchAllRecipesAPI } from './src/services/API'; // Ganti nama impor getAllRecipesAPI

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const defaultRecipeImageFromApp = require('./src/assets/images/Rawon.jpg'); // Digunakan jika API tidak ada gambar

// Dummy recipes tidak lagi jadi sumber utama jika menggunakan API
// const dummyRecipes = [ ... ];

function HomeNavigator({ recipes, handleUpdateRecipeState, handleDeleteRecipeState }) { // Tambahkan props
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" options={{ headerShown: false }}>
        {props => <HomeScreenComponent {...props} recipes={recipes} />}
      </Stack.Screen>
      <Stack.Screen name="RecipeDetail" options={{ title: 'Detail Resep' }}>
        {props => <RecipeDetailScreenComponent {...props} 
                    onRecipeUpdatedInList={handleUpdateRecipeState} 
                    onRecipeDeletedInList={handleDeleteRecipeState} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function RecipeLibraryNavigator({ recipes, handleUpdateRecipeState, handleDeleteRecipeState }) { // Tambahkan props
  return (
    <Stack.Navigator>
      <Stack.Screen name="RecipeLibraryMain" options={{ headerShown: false }}>
        {props => <RecipeLibraryComponent {...props} recipes={recipes} />}
      </Stack.Screen>
      <Stack.Screen name="RecipeDetail" options={{ title: 'Detail Resep' }}>
         {props => <RecipeDetailScreenComponent {...props} 
                     onRecipeUpdatedInList={handleUpdateRecipeState}
                     onRecipeDeletedInList={handleDeleteRecipeState} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// ProfileNavigator tidak langsung ke RecipeDetail, jadi tidak perlu callback update/delete state utama.
// RecipeForm yang dipanggil dari sini akan menggunakan handleAddNewRecipe untuk update state utama.
function ProfileNavigator({ addRecipeFunction }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" options={{ headerShown: false }} component={ProfileScreenComponent} />
      {/* RecipeForm di sini khusus untuk menambah resep baru */}
      <Stack.Screen name="RecipeForm" options={{ title: 'Tambah Resep Baru' }}>
        {props => (
          <RecipeFormComponent
            {...props}
            // Pastikan route.params diset dengan benar untuk mode tambah
            route={{
              ...props.route,
              params: {
                ...props.route.params,
                isEdit: false, // Eksplisit untuk mode tambah
                onFormSubmitSuccess: (newRecipeFromApi) => {
                  // addRecipeFunction adalah handleAddNewRecipe dari App.js
                  addRecipeFunction(newRecipeFromApi);
                  // navigation.goBack() sudah ada di RecipeForm
                }
              }
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function MainTabs({ recipes, addRecipeFunction, updateRecipeFunction, deleteRecipeFunction }) { // Tambahkan props
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'LibraryTab') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person-circle' : 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f57c00',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="HomeTab" options={{ tabBarLabel: 'Resep' }}>
        {props => <HomeNavigator {...props} recipes={recipes} 
                    handleUpdateRecipeState={updateRecipeFunction}
                    handleDeleteRecipeState={deleteRecipeFunction} />}
      </Tab.Screen>
      <Tab.Screen name="LibraryTab" options={{ tabBarLabel: 'Koleksi' }}>
        {props => <RecipeLibraryNavigator {...props} recipes={recipes} 
                    handleUpdateRecipeState={updateRecipeFunction}
                    handleDeleteRecipeState={deleteRecipeFunction} />}
      </Tab.Screen>
      <Tab.Screen name="ProfileTab" options={{ tabBarLabel: 'Profil' }}>
        {props => <ProfileNavigator {...props} addRecipeFunction={addRecipeFunction} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const App = () => {
  const [recipes, setRecipes] = useState([]); // Mulai dengan array kosong
  const [isLoading, setIsLoading] = useState(true);

  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      const apiRecipes = await fetchAllRecipesAPI(); // Menggunakan fetchAllRecipesAPI dari services
      // Pastikan image di sini adalah { uri: ... } atau null, dan default jika null dari API
      const formattedRecipes = apiRecipes.map(recipe => ({
        ...recipe,
        image: recipe.image || defaultRecipeImageFromApp // Jika API mengembalikan null, gunakan default
      }));
      setRecipes(formattedRecipes);
    } catch (error) {
      Alert.alert("Gagal Memuat", "Tidak bisa mengambil data resep dari server.");
      console.error("Error loading recipes for App.js:", error);
      setRecipes([]); // Atau set ke dummy jika ada sebagai fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes(); // Muat resep saat aplikasi pertama kali dijalankan
  }, []);

  // Fungsi ini dipanggil oleh RecipeForm (via ProfileNavigator) setelah API call sukses
  const handleAddNewRecipe = (newRecipeFromApi) => {
    // newRecipeFromApi sudah dalam format yang benar dari mapApiRecipeToAppFormat
    const recipeWithDefaultImage = {
        ...newRecipeFromApi,
        image: newRecipeFromApi.image || defaultRecipeImageFromApp
    };
    setRecipes(prevRecipes => [...prevRecipes, recipeWithDefaultImage]);
    Alert.alert("Info Aplikasi", "Resep baru ditambahkan ke daftar utama.");
  };

  // Fungsi ini dipanggil oleh RecipeDetailScreen setelah RecipeForm (edit) sukses
  const handleUpdateRecipeState = (updatedRecipeFromApi) => {
     const recipeWithDefaultImage = {
        ...updatedRecipeFromApi,
        image: updatedRecipeFromApi.image || defaultRecipeImageFromApp
    };
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeWithDefaultImage.id ? recipeWithDefaultImage : recipe
      )
    );
    Alert.alert("Info Aplikasi", "Resep diperbarui di daftar utama.");
  };
  
  const handleDeleteRecipeState = (recipeIdToDelete) => {
    setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeIdToDelete));
    Alert.alert("Info Aplikasi", "Resep dihapus dari daftar utama.");
  };


  if (isLoading && recipes.length === 0) { // Tampilkan loading jika data belum ada
      // Anda bisa membuat komponen LoadingScreen yang lebih baik
      return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Loading Recipes...</Text></View>;
  }

  return (
    <MenuProvider>
      <NavigationContainer>
        {/* Stack Navigator utama tidak lagi mendefinisikan RecipeForm secara global,
            karena RecipeForm dipanggil dari dalam ProfileNavigator (untuk add)
            atau dari RecipeDetailScreen (untuk edit), yang mana RecipeDetailScreen
            sudah menjadi bagian dari HomeNavigator atau LibraryNavigator.
            RecipeForm yang di RecipeDetail akan menggunakan definisi dari ProfileNavigator
            jika nama screen-nya sama.
            Namun, lebih baik jika RecipeForm adalah screen yang berdiri sendiri di Main Stack jika
            ingin dipanggil secara global dengan parameter berbeda.
            Untuk kasus ini, karena RecipeForm dipanggil dari dalam nested stack, kita
            tidak perlu instance global lagi jika tidak ada use case lain.
            
            Jika Anda *tetap* ingin RecipeForm sebagai screen global di App Stack (misal untuk diakses dari FAB):
            <Stack.Screen name="RecipeFormGlobal">
              {props => <RecipeFormComponent {...props} />} // Harus diberi params yang sesuai saat navigasi
            </Stack.Screen>
            Lalu dari RecipeDetailScreen.handleEdit:
            navigation.navigate('RecipeFormGlobal', { // Nama screen global
                recipe: recipe, 
                isEdit: true, 
                onFormSubmitSuccess: (updatedRecipeData) => { ... }
            });
            Dan dari ProfileScreen, jika ingin menggunakan instance RecipeForm yang sama:
            navigation.navigate('RecipeFormGlobal', { // Nama screen global
                isEdit: false, 
                onFormSubmitSuccess: (newRecipeFromApi) => { handleAddNewRecipe(newRecipeFromApi); }
            });
            Ini membuat `RecipeForm.jsx` menjadi satu komponen yang reusable.
            
            Untuk saat ini, kita biarkan RecipeForm di ProfileNavigator dan RecipeDetailScreen navigasi ke sana.
            Ini berarti RecipeForm di ProfileNavigator akan dipakai untuk edit juga.
            Maka, ProfileNavigator perlu dimodifikasi agar bisa menangani `onFormSubmitSuccess` untuk edit juga,
            atau `RecipeDetailScreen` menavigasi ke instance `RecipeForm` lain.

            Solusi paling sederhana: Biarkan `RecipeForm` di `ProfileNavigator` khusus untuk add.
            Dan `RecipeDetailScreen` akan navigasi ke screen `RecipeForm` yang terdaftar di `Stack.Navigator` utama (App).
        */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs">
            {props => <MainTabs {...props} 
                        recipes={recipes} 
                        addRecipeFunction={handleAddNewRecipe} 
                        updateRecipeFunction={handleUpdateRecipeState}
                        deleteRecipeFunction={handleDeleteRecipeState}
                        />}
          </Stack.Screen>
          {/* Definisikan RecipeForm di sini agar bisa diakses secara global untuk edit */}
          <Stack.Screen name="RecipeForm" options={({ route }) => ({
            title: route.params?.isEdit ? 'Edit Resep' : 'Tambah Resep Baru',
            headerShown: false, // Karena RecipeForm punya header custom
          })}>
            {props => (
              <RecipeFormComponent
                {...props}
                // route.params akan otomatis terisi dari navigation.navigate()
                // onFormSubmitSuccess akan ada di props.route.params jika dikirim
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

export default App;