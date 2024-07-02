import { useAppDispatch } from "@/redux/exportTypes";
import { validateOTP } from "@/redux/userSlice";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, StyleSheet, Text, Alert } from "react-native";

const OTPInput = ({ phoneNumber, onOTPComplete, setErrorText , nextStep }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      // onOTPComplete(true);
      dispatch(
        validateOTP({ enteredOTP: otp.join(""), phoneNumber: phoneNumber })
      )
        // axios.post(`${process.env.EXPO_PUBLIC_STRAPI_URL}/api/verify-code`,{enteredOTP:otp.join(''),phoneNumber:phoneNumber})
        .then((data) => {

          // if(!data) 
          // console.log(data.payload);
          if(data.payload.user){
            nextStep()
          }
         else if(data.payload.message){
            onOTPComplete(true)
          }
          else{
            {setErrorText("Invalid code ... please verify your code")
              return
            }
          }
          
          
        })

        .catch((error) => {
          setErrorText("Invalid code ... please verify your code")
          Alert.alert(error?.response?.data?.message || "An error occurred");
        });
    } else {
      onOTPComplete(false);
    }
  }, [otp]);

  const handleInputChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <View key={index} style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleInputChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            value={value}
            ref={(input) => (inputs.current[index] = input)}
          />
          {!value && <View style={styles.circle} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  inputWrapper: {
    position: "relative",
    margin: 5,
  },
  input: {
    // borderWidth: 1,
    // borderColor: '#000',
    padding: 10,
    width: 40,
    height: 50,
    textAlign: "center",
    fontSize: 18,
  },
  circle: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
  },
});

export default OTPInput;
