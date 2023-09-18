import React, { useState } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Touchable,
    TouchableOpacity
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from '../component/context';



function Login({ navigation }) {;

    const { signIn } = React.useContext(AuthContext);

    const [fdata, setFdata] = React.useState({
        email: '',
        password: '',
    });

    const [errorMsg, setErrorMsg] = useState(null);

    const storeToken = async (token) => {
        try {
            await AsyncStorage.setItem('authToken', token);
            console.log('Token stored successfully.');
        } catch (error) {
            console.error('Error storing token:', error);
        }
    };

    //"https://ep-app-server.onrender.com/parking"

    const SendToBackEnd = () => {
        //console.log(fdata);
        if (fdata.email === '' || fdata.password === '') {
            setErrorMsg('Bạn cần nhập đủ thông tin');
            console.log(errorMsg);
            return;
        } else {
            console.log(fdata);
            fetch("https://ep-app-server.onrender.com/signin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fdata),
                redirect: 'follow'
            })
                .then(res => res.json()).then(
                    data => {
                        if (data.error) {
                            setErrorMsg(data.error);
                        } else {
                            alert('Đăng nhập thành công');
                            console.log(data.token);
                            storeToken(data.token);
                            signIn();
                        }
                    }
                ).catch(error => {
                    console.log('error', error);
                    alert('error' + error);
                });
        }
    }

    return (
        <View style={styles.background}>
            <Text style={styles.header}>Đăng nhập</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Tài khoản</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    onChangeText={(text) => setFdata({ ...fdata, email: text })}
                    onPressIn={() => setErrorMsg(null)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Mật khẩu</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Mật khẩu'
                    onChangeText={(text) => setFdata({ ...fdata, password: text })}
                    secureTextEntry={true}
                    onPressIn={() => setErrorMsg(null)}
                />
            </View>
            <View style={{ width: "90%", }}>
                <TouchableOpacity 
                    onPress={() => {
                        
                    }}
                    style={{ alignItems: "flex-end", marginTop: 10, }}
                >
                    <Text style={{ color: "#2957C2", fontWeight: "bold" }}>Quên mật khẩu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ alignItems: "flex-end", marginTop: 10, }}
                    onPress={() => navigation.navigate('SignUpScreen')}
                >
                    <Text style={{ color: "#2957C2", fontWeight: "bold" }}>Tạo tài khoản mới</Text>
                </TouchableOpacity>
            </View>
            {
                errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null
            }
            <TouchableOpacity style={styles.signInBtn} onPress={() => SendToBackEnd()}>
                <Text
                    style={{ color: "#fff", textTransform: "uppercase", fontWeight: "bold" }}
                >
                    Đăng nhập</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

    },
    header: {
        marginTop: 33,
        color: "#2957C2",
        fontSize: 20,
        fontWeight: "bold"
    },
    inputContainer: {
        width: "100%",
        height: "auto",
        padding: 18,
    },
    text: {
        fontSize: 12,
        color: 'black',
    },
    error: {
        color: "red", fontSize: 13, marginTop: 50
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#979797",
        padding: 10,
        marginTop: 10,
    },
    signInBtn: {
        position: 'absolute',
        backgroundColor: "#2957C2",
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        height: 44,
        bottom: 20,
    }
});


export default Login;