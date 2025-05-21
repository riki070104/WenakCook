import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const TipsScreen = ({ tips, navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("welcome")}>
        <Text style={styles.backText}>← Kembali</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Tips Memasak</Text>
      {tips.length === 0 ? (
        <Text style={styles.noTipsText}>Belum ada tips memasak.</Text>
      ) : (
        tips.map((tip, index) => (
          <Text key={index} style={styles.tip}>{tip}</Text>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 40,
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
  noTipsText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 30,
  },
});

export default TipsScreen;
