import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView, Alert } from "react-native";
import Country from "./Country";
import OTPInput from "./OTPInput";
import { SwipeButton } from "react-native-expo-swipe-button";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const ContactDetailsScreen = ({ nextStep }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [otpComplete, setOtpComplete] = useState(false);
  console.log("🚀 ~ ContactDetailsScreen ~ otpComplete:", otpComplete)
  const [otpLoading, setOTPLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text.length > 0) {
      setShowPasswordInput(true);
    } else {
      setShowPasswordInput(false);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleSwipe = () => {
    axios.post(`${process.env.EXPO_PUBLIC_STRAPI_URL}/api/auth/local/register`,{
      email:email, username:email,password:password
    }).catch((error)=>Alert.alert(error.message))
    // nextStep()
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Country setShowOTP={setShowOTP} setOTPLoading={setOTPLoading}/>
        {otpLoading ? <Text>Waiting ...</Text> : <></> }
        {showOTP && <OTPInput onOTPComplete={setOtpComplete} />}
        {otpComplete && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              onChangeText={handleEmailChange}
              value={email}
            />
            {email.length > 0 && (
              <Text style={{ textAlign: "left", marginTop: 6, color: "#6A707C" }}>
                For communication and e-statements
              </Text>
            )}
            {/* {showPasswordInput && ( */}
              <TextInput
                style={[styles.input, { marginTop: 20 }]}
                placeholder="Enter your password"
                secureTextEntry={true}
                onChangeText={handlePasswordChange}
                value={password}
              />
            {/* ) */}
            {/* } */}
          </>
        )}
      </View>
      <View>
        <Text style={{ alignSelf: "center" }}>
          I confirm that I have read and understood the Data Privacy Policy and
          agree to GETWELTHY Services Terms & Conditions including authorizing
          GETWELTHY to verify my personal data.
        </Text>
        <SwipeButton
          width={"100%"}
          Icon={<Ionicons name="chevron-forward-outline" size={50} color="white" />}
          disabled={!password}
          onSwipeEnd={handleSwipe}
          title="Slide to confirm"
          titleStyle={{ color: "white" }}
          borderRadius={280}
          iconContainerStyle={{}}
          containerStyle={{ backgroundColor: "#03726C", overflow: "hidden" }}
          underlayTitle="Release to complete"
          underlayTitleStyle={{ color: "white", borderRadius: 280 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    flex:1,
    backgroundColor: "#eee",
    padding: 12,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 6,
  },
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 16,
    gap: 16,
  },
});

export default ContactDetailsScreen;