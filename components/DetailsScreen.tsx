import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import PassportAlert from "./PassportAlert";
import IDAlert from "./IDAlert";
import VerifIdentity from "./VerifIdentity";
import { useAppDispatch, useAppSelector } from "@/redux/exportTypes";
import { fetchUsers } from "@/redux/userSlice";

export default function DetailsScreen({nextStep}) {
  const [showIDAlert, setShowIDAlert] = useState(false);
  const [showPassportAlert, setShowPassportAlert] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(false);

  const user = useAppSelector(store => store.user.currentUser)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!user) return;
    dispatch(fetchUsers(user?.id))

    if(user?.detail){
      nextStep()
    }
  }, []);

  const refRBSheet = useRef();

  const RBContent = () => {
    if (showPassportAlert) {
      return <PassportAlert visible={showPassportAlert} onClose={() => setShowPassportAlert(false)} />
    } else if (showIDAlert) {
      return <IDAlert visible={showIDAlert} onClose={() => setShowIDAlert(false)} />
    } else {
      return <VerifIdentity visible={showVerifyAlert} onClose={() => setShowVerifyAlert(false)} nextStep={nextStep}/>
    }
  }

  const handlePress = () => {
    setSelectedDocument(true);
    setShowVerifyAlert(false);
    setShowPassportAlert(false);
    setShowIDAlert(!showIDAlert);
    refRBSheet.current.open();
  };

  const handlePress2 = () => {
    setSelectedDocument(true);
    setShowVerifyAlert(false);
    setShowIDAlert(false);
    setShowPassportAlert(!showPassportAlert);
    refRBSheet.current.open();
  };

  const handlePress3 = () => {
    setShowVerifyAlert(true);
    setSelectedDocument(false);
    setShowIDAlert(false);
    setShowPassportAlert(false);
    refRBSheet.current.open();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View>
            <Text style={styles.text}>
              To open your account, please provide the following documents and then
              verify your identity by scanning your face.
            </Text>
            <View style={styles.separator}></View>
          </View>

          <TouchableOpacity
      onPress={handlePress}
      style={[styles.contentContainer, user?.id_card?.isValid && styles.disabledContainer]}
      disabled={user?.id_card?.isValid}
    >
      <Image
        source={require("../assets/images/id.png")}
        style={styles.image}
      />
      <Text style={styles.imageName}>Emirates ID</Text>
      {user?.id_card?.isValid ? (
        <AntDesign
          name="check"
          size={24}
          color="rgb(3, 114, 108)"
          style={styles.icon}
        />
      ) : (
        <AntDesign
          name="rightcircleo"
          size={24}
          color="rgba(0, 0, 0, 0.5)"
          style={styles.icon}
        />
      )}
    </TouchableOpacity>


          <TouchableOpacity
            onPress={handlePress2}
            style={[styles.contentContainer, user?.passport?.isValid && styles.disabledContainer]}
      disabled={user?.passport?.isValid}
          >
            <Image
              source={require("../assets/images/ps.png")}
              style={styles.image}
            />
            <Text style={styles.imageName}>
              Passport{"\n"}
              <Text style={styles.additionalText}>
                Not required for UAE Nationals
              </Text>
            </Text>
            {user?.passport?.isValid ? (
        <AntDesign
          name="check"
          size={24}
          color="rgb(3, 114, 108)"
          style={styles.icon}
        />
      ) : (
        <AntDesign
          name="rightcircleo"
          size={24}
          color="rgba(0, 0, 0, 0.5)"
          style={styles.icon}
        />
      )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePress3}
            style={styles.contentContainer}
          >
            <Image
              source={require("../assets/images/vyi.png")}
              style={styles.image}
            />
            <Text style={styles.imageName}>
              Verify your identity{"\n"}
              <Text style={styles.additionalText}>
                Show your face on camera so we know it's you!{"\n"}
                <Text style={styles.additionalText}>
                  *we will store your image in our records for further processing.
                </Text>
              </Text>
            </Text>
            <AntDesign
              name="rightcircleo"
              size={24}
              color="rgba(0, 0, 0, 0.5)"
              style={styles.icon}
            />
          </TouchableOpacity>

          <RBSheet
            ref={refRBSheet}
            useNativeDriver={false}
            height={560}
            style={{ opacity: 0 }} 
            customStyles={{
              wrapper: {
                backgroundColor: "transparent",
              },
              draggableIcon: {
                backgroundColor: "#000",
              },
            }}
            customModalProps={{
              animationType: "slide",
              statusBarTranslucent: true,
            }}
            customAvoidingViewProps={{
              enabled: false,
            }}
            onClose={() => { setShowIDAlert(false); setShowPassportAlert(false) }}
          >
            {RBContent()}
          </RBSheet>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 330,
    borderRadius: 8,
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    paddingRight: 20,
    marginBottom: 20,
  },
  disabledContainer: {
    opacity: 0.5, // Adjust the opacity to visually indicate that it's disabled
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  imageName: {
    fontSize: 14,
    marginLeft: 10,
  },
  icon: {
    marginLeft: "auto",
  },
  button: {
    backgroundColor: "#037368",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    width: "80%",
    fontSize: 14,
    color: "white",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  iconContainer: {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: 12,
    padding: 8,
  },
  additionalText: {
    fontSize: 12,
    color: "grey",
  },
  text: {
    fontSize: 10,
    color: "grey",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#88888833",
    marginBottom: 16,
    paddingHorizontal: 150,
    marginTop: 20,
  },
});
