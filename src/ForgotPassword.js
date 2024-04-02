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

import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

import { useEmailState } from '../component/EmailContext'


function ForgotPassword({ navigation }) {

    const [code, setCode] = useState([]);
    const [email, setEmail] = useState(null);
    const {emailContext, setEmailContext} = useEmailState();
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [input, setInput] = useState(null);
    const theme = useColorScheme();

    const checkEmail = () => {
        if (input === null) {
            setMessageType('Chú ý');
            setMessage('Bạn cần nhập đủ thông tin');
            setModalVisible(true);
            return;
        } else {
            fetch(`${process.env.API_URL}/sendResetPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": input
                }),
                redirect: 'follow'
            })
                .then(res => res.json()).then(
                    data => {
                        console.log(data);
                        if (data.error) {
                            setMessageType('Lỗi')
                            setMessage(data.error);
                            setModalVisible(true);
                        } else {
                            setEmailContext(input);
                            setEmail(input);
                        }
                    }
                ).catch(error => {
                    console.log('error', error);
                    alert('error' + error);
                });
        }
    }

    const checkCode = () => {
        if (code.length !== 4) {
            setMessage('Mã đặt lại mật khẩu phải đủ 4 số');
            console.log(message);
            return;
        } else {
            let finalCode = '';
            for (let i = 0; i < code.length; i++) {
                finalCode += code[i];
            }
            fetch(`${process.env.API_URL}/checkResetCode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "code": finalCode,
                }),
                redirect: 'follow'
            })
                .then(res => res.json()).then(
                    data => {
                        console.log(data);
                        if (data.error) {
                            setMessageType('Lỗi');
                            setMessage(data.error);
                            setModalVisible(true);
                        } else {
                            console.log('Kiểm tra mã thành công');
                            navigation.navigate('ResetPasswordScreen');
                        }
                    }
                ).catch(error => {
                    console.log('error', error);
                    alert('error' + error);
                });
        }
    }

    const appendDigit = (num) => {
        if (code.length < 5) {
            let newCode = code.slice();
            newCode.push(num);
            setCode(newCode);
        }
    }

    const deleteDigit = (num) => {
        if (code.length > 0) {
            let newCode = code.slice();
            newCode.pop();
            setCode(newCode);
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
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity style={{ marginTop: 5 }} onPress={() => navigation.navigate(
                        'LoginScreen')}>
                        <Icon name="arrow-left" size={24} color="#212121" />
                    </TouchableOpacity>
                    <Text style={styles.textHeading}>Quên mật khẩu</Text>
                </View>
                <Image
                    source={require('../assets/images/forgotPassword.png')}
                    style={styles.image}
                >
                </Image>
                {
                    email === null ? <View>
                        <Text style={styles.textRegular}>
                            Điền vào email đăng ký tài khoản
                        </Text>
                        <View style={styles.input}>
                            <Icon name="envelope" size={17} color={isTyping === true ? '#212121' : '#999'} />
                            <TextInput
                                placeholder='Email'
                                placeholderTextColor={theme === 'dark' ? '#999' : '#999'}
                                onChangeText={(text) => setInput(text)}
                                onPressIn={() => {
                                    setMessage(null);
                                    setIsTyping(!isTyping);
                                }}
                            // onPressOut={() => {
                            //     setIsTyping(!isTyping);
                            // }}
                            />
                        </View>
                        <LinearGradient
                            colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                            style={styles.signInBtn}
                        >
                            <TouchableOpacity
                                onPress={() => checkEmail()}
                                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={styles.textLight}>
                                    Gửi mã</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View> :
                        <View style={styles.content}>
                            <Text style={styles.textRegular}>
                                Mã đặt lại mật khẩu đã được gửi đến địa chỉ Email {email}
                            </Text>
                            <View style={styles.rememberBtn}>
                                <View style={styles.codeDigit}>
                                    <Text style={styles.textDark}>{code[0] !== null ? code[0] : ' '}</Text>
                                </View>
                                <View style={styles.codeDigit}>
                                    <Text style={styles.textDark}>{code[1] !== null ? code[1] : ' '}</Text>
                                </View>
                                <View style={styles.codeDigit}>
                                    <Text style={styles.textDark}>{code[2] !== null ? code[2] : ' '}</Text>
                                </View>
                                <View style={styles.codeDigit}>
                                    <Text style={styles.textDark}>{code[3] !== null ? code[3] : ' '}</Text>
                                </View>
                            </View>
                            <Text style={styles.textRegular}>
                                Gửi lại mã sau 02:59
                            </Text>
                        </View>
                }
            </View>
            {email !== null && (

                <View>
                    {
                        code.length < 4 ?
                            <View style={styles.numpad}>
                                <View style={styles.numrow}>
                                    <TouchableOpacity
                                        style={styles.num}
                                        onPress={() => {
                                            appendDigit(7);
                                        }}
                                    >
                                        <Text style={styles.textDark}>7</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.num}
                                        onPress={() => {
                                            appendDigit(8);
                                        }}
                                    >
                                        <Text style={styles.textDark}>8</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.num}
                                        onPress={() => {
                                            appendDigit(9);
                                        }}>
                                        <Text style={styles.textDark}>9</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.numrow}>
                                    <TouchableOpacity style={styles.num}
                                        onPress={() => {
                                            appendDigit(4);
                                        }}>
                                        <Text style={styles.textDark}>4</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.num}
                                        onPress={() => {
                                            appendDigit(5);
                                        }}>
                                        <Text style={styles.textDark}>5</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.num}
                                        onPress={() => {
                                            appendDigit(6);
                                        }}>
                                        <Text style={styles.textDark}>6</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.numrow}>
                                    <TouchableOpacity style={styles.num}
                                        onPress={() => {
                                            appendDigit(1);
                                        }}>
                                        <Text style={styles.textDark}>1</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.num}
                                        onPress={() => {
                                            appendDigit(2);
                                        }}>
                                        <Text style={styles.textDark}>2</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.num}
                                        onPress={() => {
                                            appendDigit(3);
                                        }}>
                                        <Text style={styles.textDark}>3</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.numrow}>
                                    <TouchableOpacity style={styles.num}>
                                        <Text style={styles.textDark}>*</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.num}
                                        onPress={() => {
                                            appendDigit(0);
                                        }}>
                                        <Text style={styles.textDark}
                                        >0</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.num}
                                        onPress={() => {
                                            deleteDigit();
                                        }}>
                                        <Image
                                            source={require('../assets/icons/delete-left.png')}
                                            style={styles.image}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View> :
                            <LinearGradient
                                colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                                style={styles.submitBtn}
                            >
                                <TouchableOpacity
                                    onPress={() => checkCode()}
                                    style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Text style={styles.textLight}>
                                        Xác nhận</Text>
                                </TouchableOpacity>
                            </LinearGradient>

                    }
                </View>
            )
            }
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
    content: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        gap: 10,
        padding: 24,
    },
    header: {
        marginTop: 37,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    textRegular: {
        fontSize: 14,
        color: '#212121',
        fontFamily: 'Urbanist-Regular',
        alignSelf: 'center',
        textAlign: 'center',
    },
    textLight: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'Urbanist-Regular'
    },
    textDark: {
        fontSize: 18,
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
        fontSize: 24,
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
        marginTop: 24,
    },
    closeBtn: {
        width: '100%',
        height: 48,
        borderRadius: 10,
    },  
    submitBtn: {
        position: 'absolute',
        bottom: 16,
        left: 24,
        width: '90%',
        backgroundColor: "#9C9FF0",
        alignItems: 'center',
        justifyContent: 'center',
        height: 58,
        borderRadius: 10,
        marginTop: 24,
    },
    codeDigit: {
        width: 78,
        height: 61,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F7FD',
        borderRadius: 10,
    },
    numpad: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 272,
        backgroundColor: '#F1F2FF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    numrow: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    num: {
        width: '33%',
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        alignSelf: 'center',
        resizeMode: 'contain'
    },
});
export default ForgotPassword;