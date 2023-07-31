import React from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Touchable,
    TouchableOpacity
} from 'react-native'

import { AuthContext } from '../component/context';



function Login({navigation}) {
    const [userName, onChangeUserName] = React.useState("username123");
    const [password, onChangePassword] = React.useState("Abc1245");

    //const { logIn } = React.useContext(AuthContext)
    //const {loginState, setLoginState} = React.useContext(AuthContext);
    const { setCurrentUser } = React.useContext(AuthContext);

    const { signIn } = React.useContext(AuthContext);

    return (
        <View style={styles.background}>
            <Text style={styles.header}>Đăng nhập</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Tài khoản</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeUserName}
                    value={userName}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Mật khẩu</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePassword}
                    value={password}
                />
            </View>
            <View style={{ width: "90%", }}>
                <TouchableOpacity style={{ alignItems: "flex-end", marginTop: 10, }}>
                    <Text style={{ color: "#2957C2", fontWeight: "bold" }}>Quên mật khẩu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "flex-end", marginTop: 10, }}>
                    <Text style={{ color: "#2957C2", fontWeight: "bold" }}>Tạo tài khoản mới</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.signInBtn}  onPress={() => {signIn()}}>
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