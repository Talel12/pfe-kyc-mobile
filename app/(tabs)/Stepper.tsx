import { View, Text, StyleSheet, SafeAreaView, Button } from "react-native";
import React, { useState } from "react";
import StepIndicator from "react-native-step-indicator";
import CustomStepIndicator from "@/components/Indicator";
import DetailsScreen from "@/components/DetailsScreen";
import ContactDetailsScreen from "@/components/ContactDetailsScreen";

export default function Stepper() {
  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 1,
    stepStrokeCurrentColor: "#03726C",
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: "#03726C",
    stepStrokeUnFinishedColor: "#EAECF0",
    separatorFinishedColor: "#03726C",
    separatorUnFinishedColor: "#DDDDDD",
    stepIndicatorFinishedColor: "#03726C",
    stepIndicatorUnFinishedColor: "#EAECF0",
    stepIndicatorCurrentColor: "#03726C",
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: "#eee",
    stepIndicatorLabelFinishedColor: "#03726C",
    stepIndicatorLabelUnFinishedColor: "#EAECF0",
    labelColor: "#03726C",
    labelSize: 10,
    currentStepLabelColor: "#03726C",
  };

  const labels = [
    "Contact details",
    "Documents verification",
    "Face recognition",
    "Personal details",
  ];

  const nextStep: any = () => {
    setCurrentStep((prev) => (prev < labels.length - 1 ? prev + 1 : prev));
  };

  const previousStep: any = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const [currentStep, setCurrentStep] = useState(0);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ContactDetailsScreen nextStep={nextStep} />; // <Text style={styles.stepContent}>Content for Cart</Text>;
      case 1:
        return <DetailsScreen />;
      case 2:
        return (
          <Text style={styles.stepContent}>Content for Order Summary</Text>
        );
      case 3:
        return (
          <Text style={styles.stepContent}>Content for Payment Method</Text>
        );
      case 4:
        return <Text style={styles.stepContent}>Content for Track</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.title}>Share documents & </Text>
        <Text style={[styles.title,{marginTop:0}]}>verify identity</Text>
      </View>

      <View style={{ width: 400 }}>
        <StepIndicator
          onPress={(e) => {
            if (currentStep > e) {
              setCurrentStep(e);
            }
          }}
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={labels}
          stepCount={labels.length}
          renderStepIndicator={(params) => <CustomStepIndicator {...params} />}
        />
      </View>

      <View style={styles.contentContainer}>
        {renderStepContent(currentStep)}
      </View>
      {/* <View style={styles.buttonContainer}>
        <Button
          title="Previous"
          onPress={() => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))}
          disabled={currentStep === 0}
        />
        <Button
          title="Next"
          onPress={() =>
            setCurrentStep((prev) =>
              prev < labels.length - 1 ? prev + 1 : prev
            )
          }
          disabled={currentStep === labels.length - 1}
        />
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#03726C",
    paddingHorizontal: 40,
    // marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentContainer: {
    flex:1,
    // height: "100%",
    marginVertical: 20,
    padding: 10,
    //   borderWidth: 1,
    //   borderColor: '#ddd',
    //   borderRadius: 5,
  },
  stepContent: {
    fontSize: 12,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    paddingHorizontal: 20,
  },
});
