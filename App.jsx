// App.jsx
import React, {useState, useEffect, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Alert, View, Text, ActivityIndicator, Platform} from 'react-native';

import HomeScreenComponent from './src/screens/HomeScreen';
import RecipeLibraryComponent from './src/screens/RecipeLibrary.jsx';
import RecipeFormComponent from './src/screens/RecipeForm.jsx';
import ProfileScreenComponent from './src/screens/ProfileScreen.jsx';
import RecipeDetailScreenComponent from './src/screens/RecipeDetailScreen.jsx';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {MenuProvider} from 'react-native-popup-menu';
import {getAllRecipesFirestore} from './src/services/Firebase';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const defaultRecipeImageFromApp = require('./src/assets/images/Rawon.jpg');

function HomeNavigator({
  recipes,
  handleUpdateRecipeStateInApp,
  handleDeleteRecipeStateInApp,
  refreshRecipesFromFirestore,
}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#FFF8F0'},
        headerTintColor: '#b35400',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <Stack.Screen name="HomeMain" options={{headerShown: false}}>
        {props => (
          <HomeScreenComponent
            {...props}
            recipes={recipes}
            onRefreshRequest={refreshRecipesFromFirestore}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreenComponent}
        options={{title: 'Detail Resep'}}
        // Props onRecipeUpdatedInList & onRecipeDeletedInList akan di-pass melalui initialParams di MainTabs
      />
    </Stack.Navigator>
  );
}

function RecipeLibraryNavigator({
  handleUpdateRecipeStateInApp,
  handleDeleteRecipeStateInApp,
}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#FFF8F0'},
        headerTintColor: '#b35400',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <Stack.Screen
        name="RecipeLibraryMain"
        options={{headerShown: false}}
        component={RecipeLibraryComponent}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreenComponent}
        options={{title: 'Detail Resep'}}
        // Props onRecipeUpdatedInList & onRecipeDeletedInList akan di-pass melalui initialParams di MainTabs
      />
    </Stack.Navigator>
  );
}

function ProfileNavigator({addRecipeToAppState}) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileMain" component={ProfileScreenComponent} />
      <Stack.Screen name="RecipeFormProfile" options={{title: 'Tambah Resep'}}>
        {props => (
          <RecipeFormComponent
            {...props}
            route={{
              ...props.route,
              params: {
                ...(props.route.params || {}),
                isEdit: false,
                onFormSubmitSuccess: newRecipe => {
                  addRecipeToAppState(newRecipe);
                },
              },
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function MainTabs({
  recipes,
  addRecipeToAppState,
  updateRecipeInAppState,
  deleteRecipeFromAppState,
  refreshRecipesFromFirestore,
}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'HomeTab')
            iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'LibraryTab')
            iconName = focused ? 'library' : 'library-outline';
          else if (route.name === 'ProfileTab')
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#b35400',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFF8F0',
          borderTopWidth: 1,
          borderTopColor: '#E0DACC',
          paddingBottom: Platform.OS === 'ios' ? 15 : 5,
          height: Platform.OS === 'ios' ? 75 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? -10 : 3,
        },
      })}>
      <Tab.Screen name="HomeTab" options={{tabBarLabel: 'Beranda'}}>
        {props => (
          <HomeNavigator
            {...props}
            recipes={recipes}
            handleUpdateRecipeStateInApp={updateRecipeInAppState}
            handleDeleteRecipeStateInApp={deleteRecipeFromAppState}
            refreshRecipesFromFirestore={refreshRecipesFromFirestore}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="LibraryTab" options={{tabBarLabel: 'Koleksi'}}>
        {props => (
          <RecipeLibraryNavigator
            {...props}
            // RecipeLibrary fetch sendiri, tapi callback tetap berguna jika navigasi ke Detail dari sini
            handleUpdateRecipeStateInApp={updateRecipeInAppState}
            handleDeleteRecipeStateInApp={deleteRecipeFromAppState}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="ProfileTab" options={{tabBarLabel: 'Profil'}}>
        {props => (
          <ProfileNavigator
            {...props}
            addRecipeToAppState={addRecipeToAppState}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecipesFromFirestore = useCallback(async () => {
    console.log('App.jsx: Memuat resep dari Firestore...');
    setIsLoading(true);
    try {
      const firestoreRecipes = await getAllRecipesFirestore();
      const formattedRecipes = firestoreRecipes.map(recipe => ({
        ...recipe,
        image: recipe.image || defaultRecipeImageFromApp,
      }));
      setRecipes(formattedRecipes);
      console.log(`App.jsx: Berhasil memuat ${formattedRecipes.length} resep.`);
    } catch (error) {
      Alert.alert(
        'Gagal Memuat Data Awal',
        'Tidak dapat mengambil data resep dari server.',
      );
      console.error('App.jsx: Error memuat resep:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipesFromFirestore();
  }, [loadRecipesFromFirestore]);

  const handleAddNewRecipeToState = useCallback(
    newRecipeFromFirestore => {
      if (!newRecipeFromFirestore || !newRecipeFromFirestore.id) {
        console.warn(
          'App.jsx: Gagal menambah resep baru ke state, data tidak valid:',
          newRecipeFromFirestore,
        );
        loadRecipesFromFirestore();
        return;
      }
      const recipeWithDefaultImage = {
        ...newRecipeFromFirestore,
        image: newRecipeFromFirestore.image || defaultRecipeImageFromApp,
      };
      setRecipes(prevRecipes => [recipeWithDefaultImage, ...prevRecipes]);
      console.log(
        'App.jsx: Resep baru ditambahkan ke state:',
        recipeWithDefaultImage.name,
      );
    },
    [loadRecipesFromFirestore],
  );

  const handleUpdateRecipeInState = useCallback(
    updatedRecipeFromFirestore => {
      if (!updatedRecipeFromFirestore || !updatedRecipeFromFirestore.id) {
        console.warn(
          'App.jsx: Gagal update resep di state, data tidak valid:',
          updatedRecipeFromFirestore,
        );
        loadRecipesFromFirestore();
        return;
      }
      const recipeWithDefaultImage = {
        ...updatedRecipeFromFirestore,
        image: updatedRecipeFromFirestore.image || defaultRecipeImageFromApp,
      };
      setRecipes(prevRecipes =>
        prevRecipes.map(r =>
          r.id === recipeWithDefaultImage.id ? recipeWithDefaultImage : r,
        ),
      );
      console.log(
        'App.jsx: Resep di state diperbarui:',
        recipeWithDefaultImage.name,
      );
    },
    [loadRecipesFromFirestore],
  );

  const handleDeleteRecipeFromState = useCallback(
    recipeIdToDelete => {
      if (!recipeIdToDelete) {
        console.warn('App.jsx: Gagal hapus resep dari state, ID tidak valid.');
        loadRecipesFromFirestore();
        return;
      }
      setRecipes(prevRecipes =>
        prevRecipes.filter(recipe => recipe.id !== recipeIdToDelete),
      );
      console.log('App.jsx: Resep dihapus dari state, ID:', recipeIdToDelete);
    },
    [loadRecipesFromFirestore],
  );

  if (isLoading && recipes.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFF8F0',
        }}>
        <ActivityIndicator size="large" color="#b35400" />
        <Text style={{marginTop: 10, color: '#555', fontSize: 16}}>
          Memuat Resep WenakCook...
        </Text>
      </View>
    );
  }

  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="MainTabs">
            {props => (
              <MainTabs
                {...props}
                recipes={recipes}
                addRecipeToAppState={handleAddNewRecipeToState}
                updateRecipeInAppState={handleUpdateRecipeInState}
                deleteRecipeFromAppState={handleDeleteRecipeFromState}
                refreshRecipesFromFirestore={loadRecipesFromFirestore}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="RecipeForm" options={{headerShown: false}}>
            {/* RecipeForm ini akan digunakan untuk mode EDIT yang dipanggil dari RecipeDetailScreen.
                Callback onFormSubmitSuccess yang memanggil handleUpdateRecipeInState
                akan di-pass dari RecipeDetailScreen melalui navigation params.
            */}
            {props => <RecipeFormComponent {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

export default App;
