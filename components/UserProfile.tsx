// components/UserProfile.js
import { useAppDispatch, useAppSelector } from '@/redux/exportTypes';
import { fetchUsers, logout } from '@/redux/userSlice';
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const UserProfile = ({previousStep, setCurrentStep}) => {
    const user = useAppSelector(store => store?.user?.currentUser);
    const {
        username = "",
        email = "",
        phoneNumber = "",
        isValidate = "",
        passport = "",
        id_card = "",
        face = "",
        detail = "",
    } = user || {};
    const dispatch=useAppDispatch()
    const navigation = useNavigation();


    useEffect(() => {
        dispatch(fetchUsers(user?.id))
        if(!isValidate){
            previousStep()
        }
  
   }, []);

   const handleLogout = () => {
    dispatch(logout());
    setCurrentStep(0)
    navigation.navigate('index');
  };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.userInfo}>
                <Text style={styles.heading}>User Profile</Text>
                <Image
                    source={{ uri: process.env.EXPO_PUBLIC_STRAPI_URL+face?.faceImage?.url }}
                    style={styles.userFace}
                />
                {isValidate && <Text style={styles.validateIcon}>✅ Verified</Text>}
                <Text><Text style={styles.bold}>Username:</Text> {username}</Text>
                <Text><Text style={styles.bold}>Email:</Text> {email}</Text>
                <Text><Text style={styles.bold}>Phone Number:</Text> {phoneNumber}</Text>
            </View>
            <View style={styles.documentInfo}>
                 <View style={styles.documentItem}>
                    <Text style={styles.subheading}>ID Card</Text>
                    <Image
                        source={{ uri: process.env.EXPO_PUBLIC_STRAPI_URL+id_card?.frontImage?.url }}
                        style={styles.documentImage}
                    />
                    <Text><Text style={styles.bold}>Card Number:</Text> {detail?.cardNumber}</Text>
                </View>
                <View style={styles.documentItem}>
                    <Text style={styles.subheading}>Personal Information</Text>
                    <Text><Text style={styles.bold}>Name:</Text> {detail?.nom} {detail?.prenom}</Text>
                    <Text><Text style={styles.bold}>Date of Birth:</Text> {detail?.dateNaissance}</Text>
                </View>
                <Text style={styles.heading}>Document Details</Text>
                <View style={styles.documentItem}>
                    <Text style={styles.subheading}>Passport</Text>
                    <Image
                        source={{ uri: process.env.EXPO_PUBLIC_STRAPI_URL+passport?.passportImage?.url }}
                        style={styles.documentImage}
                    />
                    <Text><Text style={styles.bold}>Number:</Text> {detail?.passportNumber}</Text>
                    <Text><Text style={styles.bold}>Issue Date:</Text> {detail?.issueDate}</Text>
                    <Text><Text style={styles.bold}>Expiration Date:</Text> {detail?.expirationDate}</Text>
                <Button title="Logout" onPress={handleLogout} />
                </View>
               
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userFace: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    validateIcon: {
        color: 'green',
        fontSize: 24,
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    documentInfo: {
        flex: 1,
    },
    documentItem: {
        marginBottom: 20,
    },
    subheading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    documentImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default UserProfile;
