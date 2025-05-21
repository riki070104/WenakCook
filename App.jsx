import React, { useState } from "react";
import { View } from "react-native";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TipsScreen from "./src/screens/TipsScreen";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("welcome");

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen navigation={{ navigate: setCurrentScreen }} />;
      case "tips":
        return <TipsScreen navigation={{ navigate: setCurrentScreen }} />;
      default:
        return <WelcomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
};

export default App;
