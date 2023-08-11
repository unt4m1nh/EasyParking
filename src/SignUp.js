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
        setFdata({...fdata, idUser: idU});
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
            }  else {
                if (fdata.password !== fdata.cpassword) {
                    setErrorMsg("Mật khẩu xác nhận không chính xác");
                    return;
                } else {
                    fetch("http://10.0.3.2:3000/signup", {
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
            <Text style={styles.header}>Tạo tài khoản</Text>
            <Text style={{ marginTop: 5, fontSize: 16, color: "#000" }}>Bạn đã có tài khoản ?</Text>
            <TouchableOpacity style={{ marginTop: 5 }} onPress={() => navigation.navigate(
                'LoginScreen')}>
                <Text style={{ fontSize: 16, color: "#2957C2" }}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Họ và tên</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Nguyễn Văn A'
                    onChangeText={(text) => setFdata({ ...fdata, name: text })}
                //value={userName}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Email</Text>
                <TextInput
                    style={styles.input}
                    onPressIn={() => setErrorMsg(null)}
                    placeholder='nguyenvana@gmail.com'
                    onChangeText={(text) => setFdata({ ...fdata, email: text })}
                //onChangeText={onChangePassword}
                //value={password}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Mật khẩu</Text>
                <TextInput
                    style={styles.input}
                    onPressIn={() => setErrorMsg(null)}
                    placeholder='@NguyenVanA12345'
                    onChangeText={(text) => setFdata({ ...fdata, password: text })}
                    secureTextEntry={true}
                //onChangeText={onChangePassword}
                //value={password}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Xác nhận mật khẩu</Text>
                <TextInput
                    style={styles.input}
                    onPressIn={() => setErrorMsg(null)}
                    placeholder='@NguyenVanA12345'
                    onChangeText={(text) => setFdata({ ...fdata, cpassword: text })}
                    secureTextEntry={true}
                //onChangeText={onChangePassword}
                //value={password}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    onPressIn={() => setErrorMsg(null)}
                    placeholder='0123456789'
                    onChangeText={(text) => setFdata({ ...fdata, phoneNumber: text })}
                //onChangeText={onChangePassword}
                //value={password}
                />
            </View>
            {
                errorMsg ? <Text style={{ color: "red", fontSize: 15 }}>{errorMsg}</Text> : null
            }
            <TouchableOpacity style={styles.signInBtn} onPress={() => { SendToBackEnd(); }}>
                <Text
                    style={{ color: "#fff", textTransform: "uppercase", fontWeight: "bold" }}
                >
                    Đăng ký</Text>
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
        fontSize: 22,
        fontWeight: "bold"
    },
    inputContainer: {
        width: "100%",
        height: "auto",
        padding: 18,
    },
    text: {
        fontSize: 14,
        color: 'black',
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#979797",
        padding: 10,
        marginTop: 4,
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


export default SignUp;