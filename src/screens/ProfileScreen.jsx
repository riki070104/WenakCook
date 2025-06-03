import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Edit, Setting2, Logout } from 'iconsax-react-native';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const containerRef = useRef(null);
  const [triggerKey, setTriggerKey] = useState(0);

  const userProfile = {
    name: 'Riki Firmansyah',
    username: 'riki070104',
    bio: 'Food enthusiast & WenakCook App Developer!',
    avatar: require('../assets/images/Rawon.jpg'),
  };

  useFocusEffect(
    React.useCallback(() => {
      if (containerRef.current) {
        containerRef.current.fadeInUp(600);
      }
      setTriggerKey((prev) => prev + 1);
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Yakin mau keluar, Bang?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Keluar',
          onPress: () => console.log('User logged out (pura-pura)'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Animatable.View
      ref={containerRef}
      animation="fadeInUp"
      duration={600}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Foto & Nama */}
        <View style={styles.profileContainer}>
          <Image source={userProfile.avatar} style={styles.profileImage} />
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>@{userProfile.username}</Text>
          <Text style={styles.profileBio}>{userProfile.bio}</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer} key={triggerKey}>
          {[
            {
              icon: <Edit size="24" color="#333" variant="Outline" />,
              text: 'Tambah Resep',
              action: () => navigation.navigate('RecipeForm'),
              color: '#333',
            },
            {
              icon: <Setting2 size="24" color="#333" variant="Outline" />,
              text: 'Pengaturan',
              action: () => alert('Menu Pengaturan belum tersedia'),
              color: '#333',
            },
            {
              icon: <Logout size="24" color="red" variant="Outline" />,
              text: 'Keluar',
              action: handleLogout,
              color: 'red',
            },
          ].map((item, index) => (
            <Animatable.View
              key={item.text}
              animation="fadeInLeft"
              delay={index * 150}
              useNativeDriver
            >
              <Pressable style={styles.menuItem} onPress={item.action}>
                {item.icon}
                <Text style={[styles.menuText, { color: item.color }]}>{item.text}</Text>
              </Pressable>
            </Animatable.View>
          ))}
        </View>
      </ScrollView>
    </Animatable.View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  profileContainer: {
    marginTop: 59,
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#f57c00',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  profileBio: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 12,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});
