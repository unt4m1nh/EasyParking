import React, { useEffect, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';


function CardInfo(props) {

    return (
        <View style={styles.container1}>
            <Text style={styles.text}>{props.name} </Text>
            <Text style={styles.text}>{props.slotLeft} / {props.maxSlot}</Text>
            <Text style={styles.text}>{props.latitude}</Text>
            <Text style={styles.text}>{props.longtitude}</Text>
            <TouchableOpacity style={styles.button}>
                <Text>Click</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container1: {
        width: 370,
        height: 200,    
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        flexDirection: 'column'
    },
    text: {
        fontSize: 20,
        color: 'black',
    },
    button: {
        width: 70,
        height: 20,
        backgroundColor: 'white',
    }
})

export default CardInfo;