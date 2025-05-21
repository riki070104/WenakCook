import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const TipsScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("welcome")}>
        <Text style={styles.backText}>← Kembali</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Tips Memasak</Text>
      <Text style={styles.tip}>🍳 Panaskan wajan terlebih dahulu sebelum memasukkan bahan.</Text>
      <Text style={styles.tip}>🧂 Gunakan garam secukupnya, dan cicipi dahulu sebelum menambahkannya.</Text>
      <Text style={styles.tip}>🧼 Pastikan bahan-bahan dicuci bersih sebelum dimasak.</Text>
      <Text style={styles.tip}>🕒 Jangan terlalu lama memasak sayuran agar kandungan gizinya tetap terjaga.</Text>
      <Text style={styles.tip}>🔥 Gunakan api kecil untuk masakan yang memerlukan waktu lama seperti semur.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
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
  tip: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
});

export default TipsScreen;
