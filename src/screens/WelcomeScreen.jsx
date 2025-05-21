import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const WelcomeScreen = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>🍽️ WenakCook</Text>
        <Text style={styles.subtitle}>Resep Makanan Khas Jawa Timur</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => onNavigate("home")}>
        <Text style={styles.buttonText}>Resep Makanan</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => onNavigate("tips")}>
        <Text style={styles.buttonText}>Tips Memasak</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  box: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#ff6347",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default WelcomeScreen;
