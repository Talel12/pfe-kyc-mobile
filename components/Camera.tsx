import React, { useState, useRef } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import Webcam from "react-webcam";
import DocumentScanner from "react-native-document-scanner-plugin";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/exportTypes";
import { fetchUsers } from "@/redux/userSlice";

const { width, height } = Dimensions.get("window");

const CameraComponent = ({ onClose, origin }) => {
  const [facing, setFacing] = useState(CameraType?.back);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [scannedImage, setScannedImage] = useState(null);
  const user=useAppSelector(store=>store.user.currentUser)
  const dispatch = useAppDispatch()

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

  function toggleCameraFacing() {
    setFacing((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePicture() {
    // const options = { quality: 0.7, base64: true };

    if (cameraRef.current) {
      const photo = await cameraRef?.current?.takePictureAsync();
      console.log(photo.uri);
      setScannedImage(photo.uri);
    }
  }

  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      // console.log(result);
      setScannedImage(result.assets[0].uri);
    }
  }

  function handleSettingsPress() {
    console.log("Settings button pressed");
  }

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
  }

  async function handleSend() {
    if (!scannedImage) {
      Alert.alert("No image to send");
      return;
    }
  
    // Convert base64 to Blob
    const base64ImageData = scannedImage.split(",")[1]; // Remove the data:image/jpeg;base64, prefix
    if (!base64ImageData) {
      Alert.alert("Invalid image data");
      return;
    }
  
    const blob = b64toBlob(base64ImageData, "image/jpeg");
    const formData = new FormData();
    formData.append("files", blob, "document.jpg");
  
    try {
      // Step 1: Upload image to Strapi
      const uploadResponse = await axios({
        method: 'post',
        url: `${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}/api/upload`,
        data: formData,
        headers: {
          "content-type": "multipart/form-data",
          // Include any required authentication headers, e.g., 'Authorization': 'Bearer your-token'
        },
      });
  
      // Check if image upload was successful and get the URL
      const imageUrl = `${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}${uploadResponse?.data?.[0]?.url}`;
      console.log("🚀 ~ handleSend ~ imageUrl:", imageUrl)
      if (!imageUrl) {
        throw new Error("Image upload failed or URL not found");
      }
  
      // Step 2: Verify image with OCR API based on origin
      let verifyApiUrl;
      if (origin === "passport") {
        verifyApiUrl = `${process.env.EXPO_PUBLIC_OCR_URL}/Verify_Passport_API/`;
      } else if (origin === "idCard") {
        verifyApiUrl = `${process.env.EXPO_PUBLIC_OCR_URL}/Verify_CIN_API/`;
      }
  
      if (verifyApiUrl) {
        const verifyResponse = await axios({
          method: 'post',
          url: verifyApiUrl,
          data: { url: imageUrl },
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        console.log("🚀 ~ handleSend ~ uploadResponse:", uploadResponse);
        console.log(verifyResponse?.data?.cindocument && origin === "idCard")
        // Check if verification was successful
        if (verifyResponse?.data?.passportdocument && origin === "passport") {
          // Step 3: Create passport document in Strapi
          const createPassportResponse = await axios({
            method: 'post',
            url: `${process.env.EXPO_PUBLIC_STRAPI_URL}/api/passports`,
            data: {
              data: {
                passportImage: uploadResponse?.data?.[0].id, // Assuming this is the Strapi image ID
                isValid: true,
                user: user.id, // Assuming user object has an ID
              },
            },
            headers: {
              "Content-Type": "application/json",
              // Include any required authentication headers
              // 'Authorization': `Bearer ${yourAuthToken}`,
            },
          }).then(()=>{
            dispatch(fetchUsers(user?.id))
            onClose()});
  
          // Handle success or failure of passport document creation
          console.log("Passport document created:", createPassportResponse.data);
          // Optionally handle success message or navigate to next step
        }else if(verifyResponse?.data?.cindocument && origin === "idCard"){
          // Step 3: Create cin document in Strapi
          const createCardResponse = await axios({
            method: 'post',
            url: `${process.env.EXPO_PUBLIC_STRAPI_URL}/api/id-cards`,
            data: {
              data: {
                frontImage: uploadResponse?.data?.[0].id, // Assuming this is the Strapi image ID
                isValid: true,
                user: user.id, // Assuming user object has an ID
              },
            },
            headers: {
              "Content-Type": "application/json",
              // Include any required authentication headers
              // 'Authorization': `Bearer ${yourAuthToken}`,
            },
          }).then(()=>{
            dispatch(fetchUsers(user?.id))
            onClose()});
  
          // Handle success or failure of "idCard" document creation
          console.log("Card Id document created:", createCardResponse.data);
        } else {
          console.log("Passport verification failed or not recognized");
          // Handle case where OCR API did not recognize as a passport nor an idCard
          Alert.alert("Document is not recognized as a passport");
        }
      } else {
        console.log("Unsupported origin for verification");
        // Handle unsupported origin case
        Alert.alert("Unsupported origin for verification");
      }
    } catch (error) {
      console.error("Error during image upload and verification:", error);
      Alert.alert("Failed to upload or verify document");
    }
  }
  
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
              console.log(imageSrc);
              setScannedImage(imageSrc);
            }}
          >
            <Ionicons name="camera" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={openGallery}>
            <Ionicons name="images" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSettingsPress}>
            <Ionicons name="settings" size={40} color="white" />
          </TouchableOpacity>
        </View>
        {scannedImage && (
          <View style={styles.confirmContainer}>
            <Image source={{ uri: scannedImage }} style={styles.scannedImage} />
            <TouchableOpacity onPress={handleSend} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm Document</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        mode="picture"
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        type={facing}
      >
        {scannedImage ? (
          <View style={styles.confirmContainer}>
            <TouchableOpacity
              style={[styles.closeButton, { top: 50, zIndex: 555 }]}
              onPress={() => setScannedImage(null)}
            >
              <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>
            <Image source={{ uri: scannedImage }} style={styles.scannedImage} />
            <TouchableOpacity  onPress={handleSend} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm Document</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.borderContainer}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        )}
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
          <TouchableOpacity style={styles.button} onPress={handleSettingsPress}>
            <Ionicons name="settings" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  borderContainer: {
    position: "absolute",
    top: "15%",
    left: "10%",
    width: "80%",
    height: "60%",
    zIndex: 1,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
  },
  scannedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  confirmContainer: {
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    padding: 15,
    backgroundColor: "#03726C",
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    backgroundColor: "transparent",
  },
  webCloseButton: {
    position: "fixed",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  closeButton: {
    alignSelf: "flex-start",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
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
    borderRadius: 20,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
