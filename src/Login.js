import React, { useState } from 'react';
import {
    Text, View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    Image,
    Modal
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../component/context';
import { API_URL} from "@env"


function Login({ navigation }) {
    const theme = useColorScheme();
    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    const { signIn } = React.useContext(AuthContext);

    const [fdata, setFdata] = React.useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

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
        console.log(`${process.env.API_URL}`);
        if (fdata.email === '' || fdata.password === '') {
            setMessageType('Chú ý');
            setMessage('Bạn cần nhập đủ thông tin');
            setModalVisible(true);
            console.log(message);
            return;
        } else {
            console.log(fdata);
            fetch(`${process.env.API_URL}/signin`, {
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
                            setMessageType('Lỗi');
                            setMessage(data.error);
                            setModalVisible(true);
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
            <Modal
                animationType='fade'
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
            <View style={styles.header}>
                <Text style={styles.textHeading}>Đăng nhập</Text>
                <Text style={styles.textHeadingPurple}>Tài khoản</Text>
            </View>

            <View style={styles.input}>
                <Icon name="envelope" size={17} color={isTyping === true ? '#212121' : '#999'} />
                <TextInput
                    style={styles.inputText}
                    placeholder='Email'
                    placeholderTextColor={theme === 'dark' ? '#999' : '#999'}
                    onChangeText={(text) => setFdata({ ...fdata, email: text })}
                    onPressIn={() => {
                        setMessage(null);
                        setIsTyping(!isTyping);
                    }}
                // onPressOut={() => {
                //     setIsTyping(!isTyping);
                // }}
                />
            </View>


            <View style={styles.input}>
                <Icon name="lock" size={20} color={isTyping === true ? '#212121' : '#999'} />
                <TextInput
                    style={styles.inputText}
                    placeholder='Mật khẩu'
                    placeholderTextColor={theme === 'dark' ? '#9E9E9E' : '#9E9E9E'}
                    onChangeText={(text) => setFdata({ ...fdata, password: text })}
                    secureTextEntry={true}
                    onPressIn={() => {
                        setMessage(null);
                        setIsTyping(!isTyping);
                    }}
                // onPressOut={() => {
                //     setIsTyping(!isTyping);
                // }}
                />
            </View>
            <View style={styles.rememberBtn} >
                <CheckBox
                    disabled={false}
                    value={toggleCheckBox}
                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                    tintColors={{ true: '#4448AE', false: '#4448AE' }}
                />
                <Text style={styles.textDark}>Ghi nhớ đăng nhập</Text>
            </View>
            <LinearGradient
                colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                style={styles.signInBtn}
            >
                <TouchableOpacity
                    onPress={() => SendToBackEnd()}
                    style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={styles.textLight}>
                        Đăng nhập</Text>
                </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                style={{ alignItems: "center", marginTop: 10, }}
            >
                <Text style={{ color: "#4D5DFA", fontWeight: "bold" }}>Quên mật khẩu ?</Text>
            </TouchableOpacity>
            <Text
                style={{
                    alignSelf: 'center',
                    color: '#616161',
                    fontWeight: '600',
                    marginTop: 30,
                }}
            >
                Hoặc đăng nhập bằng
            </Text>
            <View style={styles.rememberBtn}>
                <TouchableOpacity style={styles.platform}>
                    <Image
                        source={require('../assets/images/facebook.png')}
                        style={styles.image}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.platform}>
                    <Image
                        source={require('../assets/images/google.png')}
                        style={styles.image}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.platform}>
                    <Image
                        source={require('../assets/images/apple.png')}
                        style={styles.image}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.rememberBtn}>
                <Text style={{ color: '#616161' }}>Bạn chưa có tài khoản ?</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUpScreen')}
                >
                    <Text style={{ color: "#4D5DFA", fontWeight: "bold" }}>Tạo tài khoản mới ngay</Text>
                </TouchableOpacity>
            </View>
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
        marginTop: 87,
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
        fontFamily: 'Urbanist-Regular',
        color: '#212121',
    },
    textHeadingPurple: {
        fontSize: 48,
        fontFamily: 'Urbanist-Regular',
        color: '#9A9DF0',
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


export default Login;