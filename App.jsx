// App.jsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreenComponent from './src/screens/HomeScreen';
import RecipeLibraryComponent from './src/screens/RecipeLibrary.jsx';
import RecipeFormComponent from './src/screens/RecipeForm.jsx';
import ProfileScreenComponent from './src/screens/ProfileScreen.jsx';
import RecipeDetailScreenComponent from './src/screens/RecipeDetailScreen.jsx';

import { initialRecipes, defaultRecipeImage } from './src/components/dummyRecipes.jsx';  

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const HomeStackNav = createNativeStackNavigator();
const LibraryStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

// Definisi initialRecipes udah gak ada di sini lagi

function HomeNavigator({ recipes }) {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="HomeMain">
        {props => <HomeScreenComponent {...props} recipes={recipes} />}
      </HomeStackNav.Screen>
      <HomeStackNav.Screen name="RecipeDetail" component={RecipeDetailScreenComponent} />
    </HomeStackNav.Navigator>
  );
}

function RecipeLibraryNavigator({ recipes }) {
  return (
    <LibraryStackNav.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStackNav.Screen name="RecipeLibraryMain">
        {props => <RecipeLibraryComponent {...props} recipes={recipes} />}
      </LibraryStackNav.Screen>
      <LibraryStackNav.Screen name="RecipeDetail" component={RecipeDetailScreenComponent} />
    </LibraryStackNav.Navigator>
  );
}

function ProfileNavigator({ addRecipeFunction }) {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreenComponent} />
      <ProfileStackNav.Screen name="RecipeForm">
        {props => (
          <RecipeFormComponent
            {...props}
            onSubmit={(newRecipeData) => {
              addRecipeFunction(newRecipeData);
              props.navigation.goBack();
            }}
          />
        )}
      </ProfileStackNav.Screen>
    </ProfileStackNav.Navigator>
  );
}

function MainAppTabs({ allRecipes, addNewRecipeFunc }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'LibraryTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f57c00',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [{ display: 'flex' }, null],
      })}
    >
      <Tab.Screen name="HomeTab" options={{ tabBarLabel: 'Resep' }}>
        {props => <HomeNavigator {...props} recipes={allRecipes} />}
      </Tab.Screen>
      <Tab.Screen name="LibraryTab" options={{ tabBarLabel: 'Koleksi' }}>
        {props => <RecipeLibraryNavigator {...props} recipes={allRecipes} />}
      </Tab.Screen>
      <Tab.Screen name="ProfileTab" options={{ tabBarLabel: 'Profil' }}>
        {props => <ProfileNavigator {...props} addRecipeFunction={addNewRecipeFunc} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const App = () => {
  // Gunakan initialRecipes yang diimpor buat state
  const [recipes, setRecipes] = useState(initialRecipes);

  const addNewRecipe = (newRecipeNameOrData) => {
    let newRecipeObject;
    if (typeof newRecipeNameOrData === 'string') {
      newRecipeObject = {
        id: Date.now(),
        name: newRecipeNameOrData,
        image: defaultRecipeImage, // Gunakan gambar default yang diimpor
        shortDescription: "Detail belum ditambahkan.",
        ingredients: ["Bahan belum ditambahkan."],
        steps: ["Langkah belum ditambahkan."],
      };
    } else {
      // Kalo RecipeForm udah ngirim objek resep lengkap
      newRecipeObject = { ...newRecipeNameOrData, id: Date.now(), image: newRecipeNameOrData.image || defaultRecipeImage }; // Pastikan ada image
    }
    setRecipes((prevRecipes) => [newRecipeObject, ...prevRecipes]); // Resep baru di paling atas
  };

  return (
    <NavigationContainer>
      <MainAppTabs allRecipes={recipes} addNewRecipeFunc={addNewRecipe} />
    </NavigationContainer>
  );
};

export default App;