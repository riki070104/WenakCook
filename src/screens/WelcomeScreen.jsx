import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";

const WelcomeScreen = ({ onNavigate }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade and scale looping animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1500),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 0.9,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1500),
      ])
    ).start();

    // Continuous rotation loop animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for buttons
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Side to side translation of rotating circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateXAnim, {
          toValue: 15,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: -15,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, rotateAnim, pulseAnim, translateXAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.rotatingCircle,
          {
            transform: [
              { rotate: rotateInterpolate },
              { translateX: translateXAnim },
            ],
          },
        ]}
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        Selamat Datang di WenakCook!
      </Animated.Text>
      <Animated.View style={{ transform: [{ scale: pulseAnim }], width: "80%" }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNavigate("home")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Menu Utama</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: pulseAnim }], width: "80%", marginTop: 12 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNavigate("tips")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Tips Memasak</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: pulseAnim }], width: "80%", marginTop: 20 }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onNavigate("addTip")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Tambah Data</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const CIRCLE_SIZE = 220;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  rotatingCircle: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 12,
    borderColor: "#f57c00",
    borderTopColor: "#6a8caf",
    borderRightColor: "#f57c00",
    borderBottomColor: "#6a8caf",
    borderLeftColor: "#f57c00",
    opacity: 0.25,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#333",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6a8caf",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
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

