import React from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput
} from 'react-native'



function Login({ navigation }) {
    const [userName, onChangeUserName] = React.useState("Tài khoản");
    const [password, onChangePassword] = React.useState("Mật khẩu");

    return (
        <View style={styles.background}>
            <Text style={styles.text}>Login</Text>
            <View style={styles.inputContainer}>
                <Text>Tài khoản</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeUserName}
                    value={userName}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Mật khẩu</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePassword}
                    value={password}
                />
            </View>
            <Button
                title="Đăng nhập"
                onPress={() =>
                    navigation.navigate('MapView')
                }
            />
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
    inputContainer: {
        width: "100%",
        height: "auto"
    },
    text: {
        fontSize: 30,
        color: 'black'
    },
    input: {
        width: "90%",
        height: 40,
        margin: 20,
        borderWidth: 1,
        padding: 10,
    },
});


export default Login;