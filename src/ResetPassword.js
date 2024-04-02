import React, { useState } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Touchable,
    TouchableOpacity,
    useColorScheme,
    Modal
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient';
import { useEmailState } from '../component/EmailContext';




function ResetPassword({ navigation }) {
    const theme = useColorScheme();
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const { emailContext } = useEmailState();
    const [fdata, setFdata] = React.useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const resetPassword = () => {
        console.log(fdata.newPassword, ' ', fdata.confirmPassword);
        if (fdata.newPassword !== fdata.confirmPassword) {
            setMessageType('Lỗi');
            setMessage('Mật khẩu xác nhận chưa chính xác');
            setModalVisible(true);
            return;
        } else if (fdata.newPassword === '' || fdata.confirmPassword === '') {
            setMessageType('Chú ý');
            setMessage('Bạn cần nhập đủ thông tin');
            setModalVisible(true);
            return;
        } else {
            fetch(`${process.env.API_URL}/resetPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": emailContext,
                    "newPassword": fdata.newPassword,
                }),
                redirect: 'follow'
            })
                .then(res => res.text()).then(
                    data => {
                        console.log(data);
                        if (data.error) {
                            setMessageType("Lỗi");
                            setMessage(data.error);
                            setModalVisible(true);
                        } else {
                            navigation.navigate('LoginScreen');
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
            <View style={styles.header}>
                <Text style={styles.textHeading}>Tạo lại</Text>
                <Text style={styles.textHeadingPurple}>Mật khẩu</Text>
            </View>

            <TextInput
                style={styles.input}
                onPressIn={() => setMessage(null)}
                placeholder='Mật khẩu mới'
                onChangeText={(text) => setFdata({ ...fdata, newPassword: text })}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                onPressIn={() => setMessage(null)}
                placeholder='Nhập lại mật khẩu'
                onChangeText={(text) => setFdata({ ...fdata, confirmPassword: text })}
                secureTextEntry={true}
            />

            <LinearGradient
                colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                style={styles.signInBtn}
            >
                <TouchableOpacity
                    onPress={() => resetPassword()}
                    style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={styles.textLight}>
                        Xác nhận</Text>
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
        marginTop: 36,
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


export default ResetPassword;