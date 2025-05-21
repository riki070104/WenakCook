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
} from "react-native";

const AddTipScreen = ({ onSubmit, navigation }) => {
  const [tipText, setTipText] = useState("");

  const handleSubmit = () => {
    if (tipText.trim() === "") {
      Alert.alert("Error", "Masukkan tips memasak terlebih dahulu.");
      return;
    }
    onSubmit(tipText.trim());
    setTipText("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("welcome")}>
        <Text style={styles.backText}>← Kembali</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Tambah Tips Memasak</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan tips memasak..."
        placeholderTextColor="#999"
        value={tipText}
        onChangeText={setTipText}
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "flex-start",
  },
  backButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  backText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 30,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#f57c00",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddTipScreen;
