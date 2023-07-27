import React from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput
} from 'react-native'

import { AuthContext } from '../component/context';



function QrScreen({navigation}) {

    return (
        <View style={styles.background}>
            <Text style={styles.text}>QR Tab</Text>
        </View>
    )
}

const styles = StyleSheet.create({
   background: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
   }
});


export default QrScreen;