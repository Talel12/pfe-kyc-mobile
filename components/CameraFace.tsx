import React, { useState, useRef } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Webcam from 'react-webcam';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';

const { width, height } = Dimensions.get('window');

const CameraFaceComponent = ({ onClose }) => {
  const [facing, setFacing] = useState(CameraType?.back);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [scannedImage, setScannedImage] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef?.current?.takePictureAsync();
      console.log(photo);
      setScannedImage(photo.uri);
    }
  }

  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      console.log(result);
      setScannedImage(result.assets[0].uri);
    }
  }

  function handleSettingsPress() {
    console.log("Settings button pressed");
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Webcam audio={false} ref={cameraRef} screenshotFormat="image/jpeg" style={styles.camera} />
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
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm Document</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} type={facing}>
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
        {scannedImage ? (
          <View style={styles.confirmContainer}>
            <TouchableOpacity style={[styles.closeButton,{top:50,zIndex:555}]} onPress={()=>setScannedImage(null)}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
            <Image source={{ uri: scannedImage }} style={styles.scannedImage} />
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm Document</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.overlayContainer}>
            <View style={styles.topOverlay} />
            <View style={styles.middleOverlay}>
              <View style={styles.sideOverlay} />
              <View style={styles.emptyRectangle}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
              </View>
              <View style={styles.sideOverlay} />
            </View>
            <View style={styles.bottomOverlay} />
          </View>
        )}
        
      </CameraView>
    </View>
  );
};

export default CameraFaceComponent;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    position: 'absolute',
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
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleOverlay: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    height: '70%',
    flexDirection: 'row',
  },
  sideOverlay: {
    width: '5%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  emptyRectangle: {
    flex: 1,
    borderColor: 'transparent',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'white',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: 'white',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'white',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: 'white',
  },
  scannedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  confirmContainer: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    padding: 15,
    backgroundColor: '#03726C',
    borderRadius: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    zIndex:55,
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    // backgroundColor: 'transparent',
  },
  webCloseButton: {
    zIndex:44,
    position: 'fixed',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  closeButton: {
    zIndex:44,

    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  button: {
    zIndex:44,

    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#03726C',
    borderRadius: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
