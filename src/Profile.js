import React, { useState } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';

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

    let username = "";
    const [uname, setUname] = useState(null);
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
            .then(response => response.text())
            .then(result => {
                const parsedResult = JSON.parse(result);
                username = parsedResult.name;
                console.log(username);
                setUname(username);
            })
            .catch(error => console.log('error', error));

        console.log(username);
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
            </View>
            <TouchableOpacity style={styles.signInBtn} onPress={() => { signOut() }}>
                <Text
                    style={{ color: "#fff", textTransform: "uppercase", fontWeight: "bold", marginLeft: 50 }}
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
    signInBtn: {
        position: 'absolute',
        width: '100%',
        backgroundColor: "#2957C2",
        justifyContent: 'center',
        height: 54,
        bottom: 0,
    }
});


export default Profile;