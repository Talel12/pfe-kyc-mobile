import React, { useState, useRef } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import Webcam from "react-webcam";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import axios from "axios";
import { useAppSelector } from "@/redux/exportTypes";

const { width, height } = Dimensions.get("window");

const CameraFaceComponent = ({ onClose, next, nextStep }) => {
  const [facing, setFacing] = useState(CameraType?.front);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [scannedImage, setScannedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((store) => store.user.currentUser);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setScannedImage(photo.uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
    }
  };

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const handleSend = async () => {
    if (!scannedImage) {
      Alert.alert("No image to send");
      return;
    }

    const base64ImageData = scannedImage.split(",")[1];
    if (!base64ImageData) {
      Alert.alert("Invalid image data");
      return;
    }

    const blob = b64toBlob(base64ImageData, "image/jpeg");
    const formData = new FormData();
    formData.append("files", blob, "document.jpg");

    setLoading(true);

    try {
      const uploadResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}/api/upload`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      console.log("🚀 ~ handleSend ~ uploadResponse:", uploadResponse)

      const imageUrl = `${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}${uploadResponse.data[0].url}`;
      if (!imageUrl) {
        throw new Error("Image upload failed or URL not found");
      }

      const verifyResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_OCR_URL}/Verify_Informations_API/`,
        {
          faceimage: imageUrl,
          cindocument: `${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}${user?.id_card?.frontImage?.url}`,
          passportdocument: `${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}${user?.passport?.passportImage?.url}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (verifyResponse?.data) {
        const createFacetResponse = await axios.post(
          `${process.env.EXPO_PUBLIC_STRAPI_URL}/api/faces`,
          {
            data: {
              faceImage: uploadResponse.data[0].id,
              isValid: true,
              user: user.id,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const {
          "First Name": firstName,
          "Last Name": lastName,
          "Date of birth": dateOfBirth,
          Nationality: nationality,
          "Passeport N°": passportNumber,
          "ID-Number": idNumber,
          "Date of Issue of Passport": issueDate,
          "Date of Expiry of Passport": expirationDate,
        } = await verifyResponse?.data?.data;
        console.log("🚀 ~ handleSend ~ verifyResponse:", verifyResponse)

        await axios.post(
          `${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}/api/details`,
          {
            data: {
              nom: firstName,
              prenom: lastName,
              dateNaissance: dateOfBirth,
              nationalite: nationality,
              passportNumber: passportNumber,
              cardNumber: idNumber,
              issueDate: issueDate,
              expirationDate: expirationDate,
              isValid: true,
              user: user.id,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Passport document created:", createFacetResponse.data);
        nextStep()
      } else {
        Alert.alert("Document is not recognized as a passport");
      }
    } catch (error) {
      console.error("Error during image upload and verification:", error);
      Alert.alert("Failed to upload or verify document");
    } finally {
      setLoading(false);
    }
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Webcam
          audio={false}
          ref={cameraRef}
          screenshotFormat="image/jpeg"
          style={styles.camera}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.webCloseButton} onPress={onClose}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const imageSrc = cameraRef.current.getScreenshot();
              setScannedImage(imageSrc);
            }}
          >
            <Ionicons name="camera" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={openGallery}>
            <Ionicons name="images" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Ionicons name="settings" size={40} color="white" />
          </TouchableOpacity>
        </View>
        {scannedImage && (
          <View style={styles.confirmContainer}>
            <Image source={{ uri: scannedImage }} style={styles.scannedImage} />
            <TouchableOpacity style={styles.confirmButton} onPress={handleSend}>
              <Text style={styles.confirmButtonText}>Confirm Document</Text>
            </TouchableOpacity>
          </View>
        )}
        <Modal visible={loading} transparent={true}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#03726C" />
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={facing}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Ionicons name="camera" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={openGallery}>
            <Ionicons name="images" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Ionicons name="settings" size={40} color="white" />
          </TouchableOpacity>
        </View>
        {scannedImage ? (
          <View style={styles.confirmContainer}>
            <TouchableOpacity
              style={[styles.closeButton, { top: 50, zIndex: 555 }]}
              onPress={() => setScannedImage(null)}
            >
              <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>
            <Image source={{ uri: scannedImage }} style={styles.scannedImage} />
            <TouchableOpacity style={styles.confirmButton} onPress={handleSend}>
              <Text style={styles.confirmButtonText}>Confirm Document</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <Modal visible={loading} transparent={true}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#03726C" />
          </View>
        </Modal>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#03726C",
    borderRadius: 5,
  },
  permissionButtonText: {
    color: "#fff",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  webCloseButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  confirmContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  scannedImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  confirmButton: {
    padding: 10,
    backgroundColor: "#03726C",
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default CameraFaceComponent;
