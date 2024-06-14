import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import CameraComponent from "./Camera";
// import { useNavigation } from '@react-navigation/native'; // Import de la navigation

export default function PassportAlert({ visible = true, onClose }) {
  const [visibleCamera, setVisibleCamera] = useState(false);
  // const navigation = useNavigation(); // Initialisation de la navigation

  if (!visible) return null;

  const handleContinueCamera = () => {
    setVisibleCamera(true);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={visibleCamera}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setVisibleCamera(false)}
      >
        <CameraComponent onClose={() => setVisibleCamera(false)} />
      </Modal>
      <View style={styles.innerContainer}>
        <Image
          source={require("../assets/images/psi.png")}
          style={styles.image}
        />
        <Text style={styles.passportTitle}>Scan Passport</Text>
        <Text style={styles.passportDescription}>
          Your Emirates ID should be positioned in a location with ample
          lighting and must be clearly visible on the screen.
        </Text>
        <TouchableOpacity
          onPress={handleContinueCamera}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  innerContainer: {
    backgroundColor: "white", // Couleur de fond blanche pour l'interface
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
    padding: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: "100%",
    height: "100%",
    // flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  image: {
    width: "80%",
    height: "50%",
    aspectRatio: 1.5,
    resizeMode: "contain",

    // marginBottom: 20,
    // marginTop: 20,
    alignSelf: "center",
  },
  passportTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#444444",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  passportDescription: {
    textAlign: "center",
    padding: 10,
    marginBottom: 20,
  },
  continueButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
    alignSelf: "center",
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#03726C",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
    padding: 20,
    // justifyContent: 'center',
  },

  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
