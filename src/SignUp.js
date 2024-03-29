import React, { Fragment, useEffect, useState } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Touchable,
    TouchableOpacity,
    Alert,
    Modal
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import { set } from 'mongoose';

function SignUp({ navigation }) {
    const [fdata, setFdata] = React.useState({
        name: '',
        email: '',
        password: '',
        cpassword: '',
        phoneNumber: '',
        idUser: '',
    })

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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
            setMessageType("Chú ý");
            setMessage("Bạn cần nhập đủ thông tin");
            setModalVisible(true);
            return;
        } else {
            if (fdata.password !== fdata.cpassword) {
                setMessageType("Lỗi");
                setMessage("Mật khẩu xác nhận không chính xác");
                setModalVisible(true);
                return;
            } else {
                fetch(`${process.env.API_URL}/signup`, {
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
                                setMessageType("Lỗi");
                                setMessage(data.error);
                                setModalVisible(true);
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
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.textDark}>{messageType}</Text>
                        <Text style={styles.textDarkRegular}>{message}</Text>
                        <LinearGradient
                            colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                            style={styles.closeBtn}
                        >
                            <TouchableOpacity
                                onPress={() => setModalVisible(!modalVisible)}
                                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={styles.textLight}>
                                    Đóng</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
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
                placeholder='Họ và tên'
                onChangeText={(text) => setFdata({ ...fdata, name: text })}
            //value={userName}
            />
            <TextInput
                style={styles.input}
                onPressIn={() => setMessage(null)}
                placeholder='Email'
                onChangeText={(text) => setFdata({ ...fdata, email: text })}
            //onChangeText={onChangePassword}
            //value={password}
            />
            <TextInput
                style={styles.input}
                onPressIn={() => setMessage(null)}
                placeholder='Mật khẩu'
                onChangeText={(text) => setFdata({ ...fdata, password: text })}
                secureTextEntry={true}
            //onChangeText={onChangePassword}
            //value={password}
            />
            <TextInput
                style={styles.input}
                onPressIn={() => setMessage(null)}
                placeholder='Nhập lại mật khẩu'
                onChangeText={(text) => setFdata({ ...fdata, cpassword: text })}
                secureTextEntry={true}
            //onChangeText={onChangePassword}
            //value={password}
            />
            <TextInput
                style={styles.input}
                onPressIn={() => setMessage(null)}
                placeholder='Số điện thoại'
                onChangeText={(text) => setFdata({ ...fdata, phoneNumber: text })}
            //onChangeText={onChangePassword}
            //value={password}
            />  
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
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        display: 'flex',
        width: '80%',
        gap: 36,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
    textDarkRegular: {
        fontSize: 16,
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
    closeBtn: {
        width: '100%',
        height: 48,
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