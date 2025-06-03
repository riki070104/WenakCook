// src/screens/RecipeForm.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import { addNewRecipeAPI, updateRecipeAPI } from '../services/API';

const RecipeForm = ({ navigation, route }) => {
  const { recipe: recipeToEdit, isEdit, onFormSubmitSuccess } = route.params || {};

  const [recipeName, setRecipeName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [currentStep, setCurrentStep] = useState("");
  const [stepsList, setStepsList] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  const screenTitle = isEdit ? "Edit Resep" : "Tambah Resep Baru";
  const submitButtonText = isEdit ? "Simpan Perubahan" : "Simpan Resep";

  useEffect(() => {
    if (isEdit && recipeToEdit) {
      setRecipeName(recipeToEdit.name || "");
      setShortDescription(recipeToEdit.shortDescription || "");
      setIngredientsList(Array.isArray(recipeToEdit.ingredients) ? recipeToEdit.ingredients : []);
      setStepsList(Array.isArray(recipeToEdit.steps) ? recipeToEdit.steps : []);
      setImageUri(recipeToEdit.image?.uri || null);
      setEditingRecipeId(recipeToEdit.id);
    } else {
      setRecipeName("");
      setShortDescription("");
      setIngredientsList([]);
      setStepsList([]);
      setImageUri(null);
      setEditingRecipeId(null);
    }
  }, [isEdit, recipeToEdit]);

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Pengguna batal memilih gambar');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error Pilih Gambar', `Tidak bisa memilih gambar: ${response.errorMessage}. Pastikan izin sudah diberikan.`);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
        console.log('Gambar dipilih:', response.assets[0].uri);
      }
    });
  };

  const handleAddIngredient = () => {
    if (currentIngredient.trim() !== "") {
      setIngredientsList([...ingredientsList, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setIngredientsList(prevIngredients =>
      prevIngredients.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAddStep = () => {
    if (currentStep.trim() !== "") {
      setStepsList([...stepsList, currentStep.trim()]);
      setCurrentStep("");
    }
  };

  const handleRemoveStep = (indexToRemove) => {
    setStepsList(prevSteps =>
      prevSteps.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    if (recipeName.trim() === "") {
      Alert.alert("Input Kurang", "Nama resep gak boleh kosong ya, Bang.");
      return;
    }
    if (ingredientsList.length === 0) {
      Alert.alert("Input Kurang", "Bahan-bahannya minimal satu dong, Bang.");
      return;
    }
    if (stepsList.length === 0) {
      Alert.alert("Input Kurang", "Langkah masaknya juga minimal satu ya.");
      return;
    }
    if (!imageUri && !isEdit) {
      Alert.alert("Input Kurang", "Jangan lupa pilih foto resepnya, Bang.");
      return;
    }

    const recipePayload = {
      name: recipeName.trim(),
      shortDescription: shortDescription.trim(),
      image: imageUri,
      ingredients: ingredientsList,
      steps: stepsList,
    };

    try {
      let savedRecipe;
      if (isEdit && editingRecipeId) {
        savedRecipe = await updateRecipeAPI(editingRecipeId, recipePayload);
        Alert.alert("Sukses", "Resep berhasil diperbarui!");
      } else {
        savedRecipe = await addNewRecipeAPI(recipePayload);
        Alert.alert("Sukses", "Resep berhasil ditambahkan!");
      }

      if (onFormSubmitSuccess && savedRecipe) {
        onFormSubmitSuccess(savedRecipe);
      }
      navigation.goBack();

    } catch (error) {
      Alert.alert("Gagal", `Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} resep. Coba lagi, Bang!`);
      console.error(`Error submit resep (isEdit: ${isEdit}):`, error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerNav}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{screenTitle}</Text>
        </View>

        <Text style={styles.label}>Nama Resep:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Ayam Geprek Sambal Bawang"
          value={recipeName}
          onChangeText={setRecipeName}
        />

        <Text style={styles.label}>Foto Resep:</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={handleChoosePhoto}>
          <Text style={styles.imagePickerButtonText}>
            {imageUri ? "Ganti Gambar" : "Pilih Gambar dari Galeri"}
          </Text>
        </TouchableOpacity>
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImageUri(null)}>
              <Text style={styles.removeImageButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Deskripsi Singkat (Opsional):</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Contoh: Ayam geprek pedas dengan sambal bawang mantap."
          value={shortDescription}
          onChangeText={setShortDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Bahan-bahan:</Text>
        {ingredientsList.map((ing, index) => (
          <View key={`ing-${index}`} style={styles.listItemContainer}>
            <Text style={styles.listItemText}>• {ing}</Text>
            <TouchableOpacity
              style={styles.removeListItemButton}
              onPress={() => handleRemoveIngredient(index)}
            >
              <Text style={styles.removeListItemButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addInputContainer}>
          <TextInput
            style={styles.inputInline}
            placeholder="Ketik satu bahan, lalu Tambah"
            value={currentIngredient}
            onChangeText={setCurrentIngredient}
            onSubmitEditing={handleAddIngredient}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Langkah-langkah Memasak:</Text>
        {stepsList.map((step, index) => (
          <View key={`step-${index}`} style={styles.listItemContainer}>
            <Text style={styles.listItemText}>{index + 1}. {step}</Text>
            <TouchableOpacity
              style={styles.removeListItemButton}
              onPress={() => handleRemoveStep(index)}
            >
              <Text style={styles.removeListItemButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addInputContainer}>
          <TextInput
            style={styles.inputInline}
            placeholder="Ketik satu langkah, lalu Tambah"
            value={currentStep}
            onChangeText={setCurrentStep}
            onSubmitEditing={handleAddStep}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{submitButtonText}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#f8d3b2",
    padding: 6,
    borderRadius: 8,
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: "#b35400",
    fontWeight: "600",
    textAlign: 'center',
    lineHeight: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#b35400",
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b35400',
    marginTop: 24,
    marginBottom: 10,
  },
  input: {
    borderColor: "#d0d0d0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fdfdfd',
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  addInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  inputInline: {
    flex: 1,
    borderColor: "#d0d0d0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginRight: 12,
    backgroundColor: '#fdfdfd',
  },
  addButton: {
    backgroundColor: '#ff7f50', // Coral
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  // Modifikasi listItemContainer dan tambahkan style baru
  listItemContainer: {
    backgroundColor: '#fff0e6', // Light Orange background
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row', // Untuk item dan tombol hapus sejajar
    justifyContent: 'space-between', // Item di kiri, tombol di kanan
    alignItems: 'center', // Tengah secara vertikal
  },
  listItemText: { // Style untuk teks item
    fontSize: 16,
    color: '#b35400', // Dark Orange
    flex: 1, // Agar teks mengambil ruang yang tersedia
    marginRight: 10, // Jarak antara teks dan tombol hapus
  },
  removeListItemButton: {
    backgroundColor: '#ffA07A', // LightSalmon, sedikit lebih soft dari add
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20, // Buat lebih bulat
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeListItemButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20, // Bantu tengahkan '-'
  },
  imagePickerButton: {
    backgroundColor: '#ff7f50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: 300,
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 127, 80, 0.8)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#b35400',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});

export default RecipeForm;