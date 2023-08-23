import React, { useState, useEffect } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome'

import { AuthContext } from '../component/context';

function Profile({ navigation }) {

    const { signOut } = React.useContext(AuthContext);

    const retrieveToken = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            return authToken;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    const [uname, setUname] = useState(null);
    const [accountBallance, setAccountBallance] = useState(null);
    const [payment, setPayment] = useState(null);
    const [token, setToken] = useState(null);
    retrieveToken().then((storedToken) => {
        if (storedToken) {
            // Use the stored token for authentication
            console.log(storedToken);
            setToken(storedToken);
        } else {
            // Token not available or retrieval failed
        }
    });

    const callFromBackEnd = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://10.0.3.2:3000/profile", requestOptions)
            .then(response => response.json())
            .then(result => {
                setUname(result.name);
                setPayment(result.payment);
                setAccountBallance(result.accountBallance)
            })
            .catch(error => console.log('error', error));

    }

    callFromBackEnd();

    return (
        <View style={styles.background}>
            <View style={styles.infoContainer}>
                <Image
                    style={{ marginLeft: 40 }}
                    source={require('./img/user.png')}
                />
                <View>
                    <Text style={{ color: "#FFF" }}>Xin chào !</Text>
                    <Text style={{ color: "#FFF", fontSize: 20 }}>{uname}</Text>
                </View>
                <TouchableOpacity style={{ position: 'absolute', right: 50 }}>
                    <Icon name="pencil" size={25} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.ballanceContainer}>
                <Text style={{ fontSize: 18, color: '#000' }}> Số dư ví tiền của bạn</Text>
                <View style={{display: 'flex', flexDirection: 'row', height: 'auto', alignItems: 'center'}}>
                    <Text style={{ fontSize: 40, color: '#000', marginTop: 8 }}>{accountBallance}</Text>
                    
                </View>

            </View>
         {/*    <TouchableOpacity style={styles.addCashBtn}>
                <Text
                    style={{ color: "#000", textTransform: "uppercase", fontSize: 18 }}
                >
                    Nạp tiền</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.signOutBtn} onPress={() => { signOut() }}>
                <Text
                    style={{ color: "#fff", textTransform: "uppercase", fontSize: 18 }}
                >
                    Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%",
        display: 'flex',
        alignItems: 'center'
    },
    infoContainer: {
        width: "100%",
        height: 128,
        backgroundColor: "#2957C2",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20
    },
    ballanceContainer: {
        width: '90%',
        height: 400,
        marginTop: 24,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        padding: 20
    },
    addCashBtn: {
        position: 'absolute',
        width: '90%',
        backgroundColor: "#FFF",
        justifyContent: 'center',
        height: 54,
        bottom: 80,
        marginLeft: 20,
        alignItems: 'center',
        color: "#2957C2",
        borderColor: '#000',
        borderWidth: 1,
    },
    signOutBtn: {
        position: 'absolute',
        width: '90%',
        backgroundColor: "#2957C2",
        justifyContent: 'center',
        height: 54,
        bottom: 20,
        marginLeft: 20,
        alignItems: 'center'
    }
});


export default Profile;