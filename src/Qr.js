import React, { useState } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    TouchableOpacity
} from 'react-native'

import { AuthContext } from '../component/context';

import QRCode from 'react-native-qrcode-svg';


function QrScreen({ navigation }) {
    const [qrData, setQRData] = useState('');
    const [showQR, setShowQR] = useState(false);

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    const generateQRCode = () => {
        const data = generateRandomString(10);
        console.log(data);
        setQRData(data);
        setShowQR(true);
    }
    return (
        <View style={styles.background}>
            {showQR ? (
                <QRCode value={qrData} size={200} />
            ) : (
                <TouchableOpacity>
                 
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={styles.generatebtn} onPress={generateQRCode}>
                <View>
                    <Text style={{ color: 'white', fontSize: 18 }}>Generate QR Code</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    generatebtn: {
        position: 'absolute',
        bottom: 50,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 8,
    }
});


export default QrScreen;