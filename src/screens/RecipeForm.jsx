// src/screens/RecipeForm.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView, // Kita butuh ScrollView karena formnya bakal panjang
} from "react-native";

const RecipeForm = ({ onSubmit, navigation }) => {
  const [recipeName, setRecipeName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [currentStep, setCurrentStep] = useState("");
  const [stepsList, setStepsList] = useState([]);

  const handleAddIngredient = () => {
    if (currentIngredient.trim() !== "") {
      setIngredientsList([...ingredientsList, currentIngredient.trim()]);
      setCurrentIngredient(""); // Kosongin input bahan
    }
  };

  const handleAddStep = () => {
    if (currentStep.trim() !== "") {
      setStepsList([...stepsList, currentStep.trim()]);
      setCurrentStep(""); // Kosongin input langkah
    }
  };

  const handleSubmit = () => {
    if (recipeName.trim() === "") {
      Alert.alert("Error", "Nama resep gak boleh kosong ya, Bang.");
      return;
    }
    if (ingredientsList.length === 0) {
      Alert.alert("Error", "Bahan-bahannya minimal satu dong, Bang.");
      return;
    }
    if (stepsList.length === 0) {
      Alert.alert("Error", "Langkah masaknya juga minimal satu ya.");
      return;
    }

    const newRecipeData = {
      name: recipeName.trim(),
      shortDescription: shortDescription.trim(),
      // Untuk gambar, sementara kita pake default di App.jsx atau Abang bisa tambahin ImagePicker di sini
      // image: require("../assets/images/default-resep.png"), // Ini contoh aja
      ingredients: ingredientsList,
      steps: stepsList,
    };

    onSubmit(newRecipeData); // Kirim objek resep lengkap

    // Reset form setelah submit
    setRecipeName("");
    setShortDescription("");
    setIngredientsList([]);
    setCurrentIngredient("");
    setStepsList([]);
    setCurrentStep("");
    // navigation.goBack(); // Ini udah dihandle di App.jsx pas manggil onSubmit
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // KeyboardAvoidingView harus bungkus ScrollView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.headerNav}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Tambah Resep Baru</Text>
        </View>


        <Text style={styles.label}>Nama Resep:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Nasi Goreng Spesial"
          value={recipeName}
          onChangeText={setRecipeName}
        />

        <Text style={styles.label}>Deskripsi Singkat (Opsional):</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Contoh: Nasi goreng sederhana tapi rasanya juara!"
          value={shortDescription}
          onChangeText={setShortDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Bahan-bahan:</Text>
        {ingredientsList.map((ing, index) => (
          <Text key={`ing-${index}`} style={styles.listItem}>• {ing}</Text>
        ))}
        <View style={styles.addInputContainer}>
          <TextInput
            style={styles.inputInline}
            placeholder="Ketik satu bahan, lalu Tambah"
            value={currentIngredient}
            onChangeText={setCurrentIngredient}
            onSubmitEditing={handleAddIngredient} // Bisa juga tambah pas enter
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Langkah-langkah Memasak:</Text>
        {stepsList.map((step, index) => (
          <Text key={`step-${index}`} style={styles.listItem}>{index + 1}. {step}</Text>
        ))}
        <View style={styles.addInputContainer}>
          <TextInput
            style={styles.inputInline}
            placeholder="Ketik satu langkah, lalu Tambah"
            value={currentStep}
            onChangeText={setCurrentStep}
            onSubmitEditing={handleAddStep}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Simpan Resep</Text>
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
    padding: 20,
    paddingBottom: 50, // Kasih space di bawah
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10, // Jarak ke judul
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 22, // Sedikit lebih kecil karena ada tombol back di samping
    fontWeight: "bold",
    color: "#333",
    // textAlign: "center", // Gak perlu center lagi
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  addInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputInline: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#6a8caf',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listItem: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    marginBottom: 5,
    paddingVertical: 3,
  },
  submitButton: {
    backgroundColor: "#f57c00",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20, // Kasih jarak atas
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default RecipeForm;