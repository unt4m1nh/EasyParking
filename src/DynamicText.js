import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DynamicText = ({ text }) => {
  // Calculate the font size based on the text length
  const getFontSize = () => {
    const textLength = text.trim().length;
    if (textLength < 20) {
      return 22;
    } else if (textLength < 30) {
      return 18;
    } else {
      return 13;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, fontSize: getFontSize() }}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontSize: 16, // Default font size
    fontWeight: 'bold'
  },
});

export default DynamicText;