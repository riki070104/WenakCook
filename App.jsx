import React, { useState } from "react";
import { View } from "react-native";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TipsScreen from "./src/screens/TipsScreen";
import AddTipScreen from "./src/screens/AddTipScreen";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [tips, setTips] = useState([
    "🍳 Panaskan wajan terlebih dahulu sebelum memasukkan bahan.",
    "🧂 Gunakan garam secukupnya, dan cicipi dahulu sebelum menambahkannya.",
    "🧼 Pastikan bahan-bahan dicuci bersih sebelum dimasak.",
    "🕒 Jangan terlalu lama memasak sayuran agar kandungan gizinya tetap terjaga.",
    "🔥 Gunakan api kecil untuk masakan yang memerlukan waktu lama seperti semur.",
  ]);

  const addTip = (newTip) => {
    setTips((prevTips) => [...prevTips, newTip]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen navigation={{ navigate: setCurrentScreen }} />;
      case "tips":
        return <TipsScreen tips={tips} navigation={{ navigate: setCurrentScreen }} />;
      case "addTip":
        return (
          <AddTipScreen
            onSubmit={(tip) => {
              addTip(tip);
              setCurrentScreen("tips");
            }}
            navigation={{ navigate: setCurrentScreen }}
          />
        );
      default:
        return <WelcomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
};

export default App;

