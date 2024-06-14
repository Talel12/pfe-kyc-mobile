import React from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { SwipeButton } from "react-native-expo-swipe-button";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function HomeScreen() {
  const navigation = useNavigation(); 
  return (
    <View style={styles.titleContainer}>
      <Image
        style={styles.heroImage}
        source={require("../../assets/images/welcome.png")}
      />
      <View style={styles.textContainer}>
        <Text style={styles.heroTitle}>Welcome back!</Text>
        <Text style={styles.heroDesc}>
          Your previous account opening request has not been completed
        </Text>
        {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
        <SwipeButton
          width={"100%"}
          Icon={
            <Ionicons name="chevron-forward-outline" size={50} color="white" />
          }
          onSwipeEnd={() => navigation.navigate('Stepper')}
          title="Start a new application"
          titleStyle={{ color: 'white' }}
          borderRadius={280}
          iconContainerStyle={{}}
          containerStyle={{ backgroundColor: "#03726C", overflow: "hidden" }}
          underlayTitle="Release to complete"
          underlayTitleStyle={{ color: "white", borderRadius: 280 }}
        />
        {/* <SwipeButton
            title="Start a new application"
            width={358}
            containerStyles={{ backgroundColor: "#03726C" }}
            thumbIconBackgroundColor="#000"
            onSwipeSuccess={() => {
              console.log("Button Swiped");
            }}
          /> */}
        {/* </GestureHandlerRootView> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  heroImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 16,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 20,
    color: "#556",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  heroDesc: {
    fontSize: 16,
    paddingHorizontal: 36,
    color: "#999",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
});
