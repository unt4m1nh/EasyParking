import React, { Fragment, useEffect, useState } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Touchable,
    TouchableOpacity,
    Alert
} from 'react-native'

import { AuthContext } from '../component/context';
import data from './data/data';
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';

function SignUp({ navigation }) {
    const [fdata, setFdata] = React.useState({
        name: '',
        email: '',
        password: '',
        cpassword: '',
        phoneNumber: '',
        idUser: '',
    })

    const [errorMsg, setErrorMsg] = useState(null);

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    //handle signup request

    const SendToBackEnd = () => {
        const idU = generateRandomString(8);
        setFdata({ ...fdata, idUser: idU });
        var raw = JSON.stringify({
            "name": fdata.name,
            "email": fdata.email,
            "password": fdata.password,
            "phoneNumber": fdata.phoneNumber,
            "idUser": fdata.idUser
        })
        //console.log(fdata);
        if (fdata.name == '' ||
            fdata.email == '' ||
            fdata.password == '' ||
            fdata.phoneNumber == '' ||
            fdata.cpassword == '' ||
            fdata.idUser == '') {
            setErrorMsg("Bạn cần nhập đủ thông tin");
            return;
        } else {
            if (fdata.password !== fdata.cpassword) {
                setErrorMsg("Mật khẩu xác nhận không chính xác");
                return;
            } else {
                fetch("https://ep-app-server.onrender.com/signup", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: raw,
                    redirect: 'follow'
                })
                    .then(res => res.json()).then(
                        data => {
                            if (data.error) {
                                setErrorMsg(data.error);
                            } else {
                                alert('Tạo tài khoản thành công');
                                navigation.navigate("LoginScreen");
                            }
                        }
                    ).catch(error => console.log('error', error));
            }
        }
    }
    return (
        <View style={styles.background}>
            <TouchableOpacity style={{ marginTop: 5 }} onPress={() => navigation.navigate(
                'LoginScreen')}>
                <Icon name="arrow-left" size={17} color="#212121" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.textHeading}>Tạo</Text>
                <Text style={styles.textHeadingPurple}>Tài khoản</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder='Nguyễn Văn A'
                onChangeText={(text) => setFdata({ ...fdata, name: text })}
            //value={userName}
            />
            <TextInput
                style={styles.input}
                onPressIn={() => setErrorMsg(null)}
                placeholder='nguyenvana@gmail.com'
                onChangeText={(text) => setFdata({ ...fdata, email: text })}
            //onChangeText={onChangePassword}
            //value={password}
            />
            <TextInput
                style={styles.input}
                onPressIn={() => setErrorMsg(null)}
                placeholder='@NguyenVanA12345'
                onChangeText={(text) => setFdata({ ...fdata, password: text })}
                secureTextEntry={true}
            //onChangeText={onChangePassword}
            //value={password}
            />
            <TextInput
                style={styles.input}
                onPressIn={() => setErrorMsg(null)}
                placeholder='@NguyenVanA12345'
                onChangeText={(text) => setFdata({ ...fdata, cpassword: text })}
                secureTextEntry={true}
            //onChangeText={onChangePassword}
            //value={password}
            />
            <TextInput
                style={styles.input}
                onPressIn={() => setErrorMsg(null)}
                placeholder='0123456789'
                onChangeText={(text) => setFdata({ ...fdata, phoneNumber: text })}
            //onChangeText={onChangePassword}
            //value={password}
            />

            {
                errorMsg ? <Text style={{ color: "red", fontSize: 15 }}>{errorMsg}</Text> : null
            }
            <LinearGradient
                colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                style={styles.signInBtn}
            >
                <TouchableOpacity
                    style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { SendToBackEnd(); }}>
                    <Text style={styles.textLight} >
                        Tiếp tục</Text>
                </TouchableOpacity>
            </LinearGradient>
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
        backgroundColor: "#FFFFFF",
        padding: 24,
        gap: 10,
    },
    header: {
        marginTop: 37,
    },
    textLight: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'Urbanist-Regular'
    },
    textDark: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
        fontFamily: 'Urbanist-Regular'
    },
    textHeading: {
        fontSize: 48,
        fontWeight: "bold",
        fontFamily: 'Urbanist-Regular',
        color: '#212121',
    },
    textHeadingPurple: {
        fontSize: 48,
        fontWeight: "bold",
        fontFamily: 'Urbanist-Regular',
        color: '#9A9DF0',
    },
    error: {
        color: "red", fontSize: 13, marginTop: 50
    },
    input: {
        width: "100%",
        height: 60,
        backgroundColor: '#F8F7FD',
        borderRadius: 10,
        marginTop: 10,
        color: '#212121',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        gap: 10,
    },
    inputText: {
        width: "100%",
        color: '#212121',
        height: 60,
        borderRadius: 10,
        backgroundColor: '#F8F7FD',
    },
    rememberBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        gap: 16,
    },
    signInBtn: {
        backgroundColor: "#9C9FF0",
        alignItems: 'center',
        justifyContent: 'center',
        height: 58,
        marginTop: 16,
        borderRadius: 10,
    },
    platform: {
        width: 88,
        height: 60,
        borderRadius: 16,
        borderColor: '#EEEEEE',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        resizeMode: 'contain',
    },
});


export default SignUp;