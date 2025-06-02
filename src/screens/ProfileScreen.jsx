// src/screens/ProfileScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  // Data profil pura-pura dulu ya, Bang
  const userProfile = {
    name: "Riki Firmansyah", // Ganti sama nama Abang
    username: "riki070104",
    bio: "Food enthusiast & WenakCook App Developer!",
    // Ganti pake foto Abang, atau biarin default kalo belum ada
    avatar: require('../assets/images/Rawon.jpg'), // Pastiin ada gambar ini di assets
    recipesContributed: 5, // Contoh aja
    tipsShared: 3,         // Contoh aja
  };

  const handleLogout = () => {
    // Di aplikasi beneran, di sini bakal ada proses logout
    Alert.alert(
      "Logout",
      "Yakin mau keluar, Bang?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Ya, Keluar", onPress: () => console.log("User logged out (pura-pura)") } // Nanti bisa diganti navigasi ke layar login
      ]
    );
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Image source={userProfile.avatar} style={styles.avatar} />
      <Text style={styles.name}>{userProfile.name}</Text>
      <Text style={styles.username}>@{userProfile.username}</Text>
      <Text style={styles.bio}>{userProfile.bio}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.recipesContributed}</Text>
          <Text style={styles.statLabel}>Resep Dibuat</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.tipsShared}</Text>
          <Text style={styles.statLabel}>Tips Dibagi</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.addRecipeButton]}
        onPress={() => navigation.navigate('RecipeForm')}
      >
        <Text style={styles.buttonText}>Tambah Resep/Tip Baru</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#f57c00',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 30,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f57c00',
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.20,
    shadowRadius: 2.62,
    elevation: 4,
  },
  addRecipeButton: {
    backgroundColor: '#f57c00',
  },
  logoutButton: {
    backgroundColor: '#6a8caf', // Warna beda buat logout
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;