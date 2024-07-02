import { Ionicons } from '@expo/vector-icons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import React, {type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ServiceCard = ({title, name }: IconProps<ComponentProps<typeof Ionicons>['name']>) => {
    return (
        <View style={styles.card}>
            <Ionicons name={name} size={50}/>
            <Text style={{fontSize:12}}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card:{
        padding:8,
        borderColor:"#555555",
        borderWidth:1,
        borderRadius:8,
        margin:8,
        width:100,
        height:100,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#FFFFFF"
    }
})

export default ServiceCard;
