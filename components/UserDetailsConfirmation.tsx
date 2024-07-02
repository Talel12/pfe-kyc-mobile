import { useAppDispatch, useAppSelector } from "@/redux/exportTypes";
import { fetchUsers } from "@/redux/userSlice";
import axios from "axios";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const UserDetailsConfirmation = ({ nextStep }) => {
  const userDetails = useAppSelector((store) => store.user.currentUser);
  const user = useAppSelector((store) => store.user.currentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(user){
         dispatch(fetchUsers(user?.id))
        }
   
    if (user?.isValidate) {
      nextStep();
    }
  }, [dispatch, nextStep, user]);

  const onConfirm = () => {
    axios
      .put(
        `${process.env.EXPO_PUBLIC_TUNNEL_STRAPI_URL}/api/users/${user?.id}`,
        { isValidate: true }
      )
      .then(() => {
        nextStep();
      });
  };

  if (!userDetails) {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.errorText}>No user details available</Text>
        </View>
      </ScrollView>
    );
  }

  const {
    nom="",
    prenom="",
    dateNaissance="",
    nationalite="",
    passportNumber="",
    cardNumber="",
    issueDate="",
    expirationDate="",
  } = userDetails.detail  || {};

  return (
    <ScrollView style={styles.keyboardAvoidingView}>
      <View style={styles.container && styles.scrollViewContent}>
        <Text style={styles.title}>User Details</Text>
        <Text style={styles.label}>First Name: {nom}</Text>
        <Text style={styles.label}>Last Name: {prenom}</Text>
        <Text style={styles.label}>Date of Birth: {dateNaissance}</Text>
        <Text style={styles.label}>Nationality: {nationalite}</Text>
        <Text style={styles.label}>Passport Number: {passportNumber}</Text>
        <Text style={styles.label}>ID Number: {cardNumber}</Text>
        <Text style={styles.label}>Issue Date: {issueDate}</Text>
        <Text style={styles.label}>Expiration Date: {expirationDate}</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    // backgroundColor: "white",
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  confirmButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#03726C",
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default UserDetailsConfirmation;
