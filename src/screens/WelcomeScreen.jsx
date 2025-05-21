import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const WelcomeScreen = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang di WenakCook!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate("home")}
      >
        <Text style={styles.buttonText}>Menu Utama</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate("tips")}
      >
        <Text style={styles.buttonText}>Tips Memasak</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onNavigate("addTip")}
      >
        <Text style={styles.buttonText}>Tambah Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6a8caf",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  addButton: {
    backgroundColor: "#f57c00",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 30,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default WelcomeScreen;
