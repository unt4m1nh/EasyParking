import React, { useState, useEffect } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    TouchableOpacity,
    useColorScheme
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';


function QrScreen({ navigation }) {

    const theme = useColorScheme()

    const retrieveToken = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            return authToken;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    const [qrData, setQRData] = useState('');
    const [showQR, setShowQR] = useState(false);

    const [userStatus, setUserStatus] = useState(false);
    const [id, setUid] = useState(null);

    const [generated, setGenerated] = useState(false);
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState('Bấm nút để tạo mã QR')


    retrieveToken().then((storedToken) => {
        if (storedToken) {
            // Use the stored token for authentication
            setToken(storedToken);
        } else {
            console.log('Retrieval failed');
            // Token not available or retrieval failed
        }
    });

    const callUserID = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://ep-app-server.onrender.com/profile", requestOptions)
            .then(response => response.json())
            .then(result => {
                setUid(result.idUser);
                //setFdata({ ...fdata, name: uname, email: result.email, plate: result.plate, phoneNumber: result.phoneNumber })
            })
            .catch(error => console.log('error', error));

    }

    const getUserStatus = () => {
        var myHeaders = new Headers();
        console.log('Re-update after 10 secs');
        if (token) {
            myHeaders.append("Authorization", "Bearer " + token);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://ep-app-server.onrender.com/profile", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('User status:', result.booking);
                    if (result.booking === 1) {
                        setUserStatus(true);
                    } else {
                        setUserStatus(false);
                    }
                })
                .catch(error => console.log('error', error));
        } else {
            console.log("Error vkl");
        }

        //console.log(username);
    }


    useEffect(() => {
        const interval = setInterval(() => {
            getUserStatus();
        }, 10000);
        return () => clearInterval(interval);
    }, [token]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (generated === false) {
                generateQRCode();
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [generated]);

    function generateRandomString(length) {
        callUserID();
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return id + result;
    }

    const generateQRCode = () => {
        const data = generateRandomString(10);
        const qrCode = 'ndd12345' + data
        setQRData(qrCode);
        setShowQR(true);
        setMessage('Đây là mã QR của bạn');
        setGenerated(true);
    }

    return (
        <View style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:theme=='dark'?'#000':'white',
            width: '100%',
            height: '100%',
        }}>
            {
                !userStatus ? (
                    <Text>Mã QR chỉ có thể tạo khi bạn đã đặt chỗ</Text>
                ) : (
                    <TouchableOpacity style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#000', fontSize: 20 }}>{message}</Text>
                        <View style={styles.qrContainer}>

                            <QRCode value={qrData} size={250} />

                        </View>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    qrContainer: {
        marginTop: 30,
        width: 300,
        height: 300,
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default QrScreen;