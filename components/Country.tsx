import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";

const Country = ({ setPhoneNumber, setShowOTP, setOTPLoading }) => {
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [PhoneInput, setPhoneInput] = useState<null | React.FC<any>>(null);
 
  useEffect(() => {
    // Dynamically import PhoneInput only on the client side
    import("react-native-international-phone-number")
      .then((module) => {
        setPhoneInput(() => module.default);
      })
      .catch((err) => console.error("Failed to load PhoneInput module", err));
  }, []);

  function handleSend(){
    {
      setOTPLoading(true);
      // Send SMS request to Strapi API
      setPhoneNumber(`${selectedCountry?.callingCode}${inputValue}`)
      axios
        .post(`${process.env.EXPO_PUBLIC_STRAPI_URL}/api/send-sms`, {
          phoneNumber: `${selectedCountry?.callingCode}${inputValue}`,
        })
        .then(() => {
          setShowOTP(true),
          setOTPLoading(false);
        })
        .catch((error) => {
          setOTPLoading(false);
          console.error("Error sending SMS:", error);
          Alert.alert("An error occurred while sending the SMS");
        });
      console.log(selectedCountry?.callingCode, inputValue);
    }
  }

  function handleInputValue(phoneNumber: string) {
    setInputValue(phoneNumber);
  }

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  if (!PhoneInput) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={handleSend}
      >
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
      <PhoneInput
        placeholder="Phone number"
        value={inputValue}
        defaultCountry="AE"
        onChangePhoneNumber={handleInputValue}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={handleSelectedCountry}
      />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoText}>
          Please verify your mobile number to proceed
        </Text>
        {/* Uncomment below lines to display selected country and phone number */}
        {/* 
        <Text>
          Country: {`${selectedCountry?.name?.en} (${selectedCountry?.cca2})`}
        </Text>
        <Text>
          Phone Number: {`${selectedCountry?.callingCode} ${inputValue}`}
        </Text>
        */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 16,
  },
  verifyButton: {
    position: "absolute",
    top: 22,
    right: 6,
    zIndex: 999,
    backgroundColor: "white",
    padding: 10,
  },
  verifyButtonText: {
    color: "#03726C",
    fontWeight: "700",
  },
  infoTextContainer: {
    marginTop: 10,
  },
  infoText: {
    color: "#555",
  },
  loadingContainer: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Country;
