import React, { useState } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Touchable,
    TouchableOpacity,
    useColorScheme,
    Image
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

function ForgotPassword({ navigation }) {

    const [code, setCode] = useState([]);

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
                <Text style={styles.textRegular}>
                    Mã đặt lại mật khẩu đã được gửi đến số +84123456789
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
    textDark: {
        fontSize: 18,
        fontWeight: 'bold',
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