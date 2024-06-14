import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomStepIndicator = ({ position, stepStatus }) => {
  const isActive = stepStatus === 'current' || stepStatus === 'finished';
  
  return (
    <View style={[styles.outerCircle, { backgroundColor: isActive ? '#A6DBD8' : '#fff' }]}>
      <View style={[styles.innerCircle, { backgroundColor: isActive ? '#03726C' : '#EAECF0' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default CustomStepIndicator;
