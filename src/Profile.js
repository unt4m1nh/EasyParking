import React, { useState, useEffect } from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome'

import { AuthContext } from '../component/context';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function Profile({ navigation }) {

    const { signOut } = React.useContext(AuthContext);

    const retrieveToken = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            return authToken;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    const [fdata, setFdata] = React.useState({
        name: '',
        email: '',
        plate: '',
        phoneNumber: '',
        accountBallance: '',
        payment: '',
    })


    const [uname, setUname] = useState(null);
    const [id, setUid] = useState(null);
    const [email, setEmail] = useState(null);
    const [plate, setPlate] = useState(null);
    const [phoneNumber, setPhonenumber] = useState(null);
    const [accountBallance, setAccountBallance] = useState(null);
    const [payment, setPayment] = useState(null);
    const [token, setToken] = useState(null);
    const [showUpdate, setShowUpdate] = useState(false);

    const [errorMsg, setErrorMsg] = useState(null);

    retrieveToken().then((storedToken) => {
        if (storedToken) {
            // Use the stored token for authentication
            setToken(storedToken);
        } else {
            // Token not available or retrieval failed
        }
    });

    const callFromBackEnd = () => {
        var myHeaders = new Headers();
        console.log(token);
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://ep-app-server.onrender.com/profile", requestOptions)
            .then(response => response.json())
            .then(result => {
                setUid(result._id);
                setUname(result.name);
                setPayment(result.payment);
                setAccountBallance(result.accountBallance);
            })
            .catch(error => console.log('error', error));

    }

    const getUserInfo = () => {
        var myHeaders = new Headers();
        console.log(token);
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://ep-app-server.onrender.com/profile", requestOptions)
            .then(response => response.json())
            .then(result => {
                setEmail(result.email);
                setPlate(result.plate);
                setPhonenumber(result.phoneNumber);
            })
            .catch(error => console.log('error', error));
    }


    //console.log(id);

    const updateUserInfo = () => {
        if (fdata.email === '' && fdata.name === '' && fdata.phoneNumber === '' && fdata.plate === '') {
            console.log('Bạn cần nhập đủ thông tin')
            setErrorMsg('Bạn cần nhập đủ thông tin')
        } else {
            var raw = JSON.stringify({
                "name": fdata.name,
                "email": fdata.email,
                "phoneNumber": fdata.phoneNumber,
                "plate": fdata.plate,
            })

            var requestOptions = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: raw
            };

            fetch(`https://ep-app-server.onrender.com/update/${id}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('Da update');
                    setShowUpdate(false);
                })
                .catch(error => console.log('error', error));
        }
    }

    const deleteToken = async (storedToken) => {
        try {
            await AsyncStorage.removeItem(storedToken);
            console.log('Item deleted successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }


    callFromBackEnd();
    getUserInfo();

    return (
        <View style={styles.background}>
            <View style={styles.infoContainer}>
                <Image
                    style={{ marginLeft: 40 }}
                    source={require('./img/user.png')}
                />
                <View>
                    <Text style={{ color: "#FFF" }}>Xin chào !</Text>
                    <Text style={{ color: "#FFF", fontSize: 18 }}>{uname}</Text>
                </View>
                <TouchableOpacity
                    style={{ position: 'absolute', right: 50 }}
                    onPress={() => {
                        getUserInfo();
                        setShowUpdate(true);
                    }}
                >
                    <Icon name="pencil" size={25} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.ballanceContainer}>
                <Text style={{ fontSize: RFValue(16), color: '#000' }}> Số dư ví tiền của bạn</Text>
                <View style={{ display: 'flex', flexDirection: 'row', height: 'auto', alignItems: 'center' }}>
                    <Text style={{ fontSize: RFValue(36), color: '#000', marginTop: 8 }}>{accountBallance}</Text>

                </View>

            </View>
           
            <TouchableOpacity style={styles.signOutBtn} onPress={() => {
                signOut();
                deleteToken(token);
            }}>
                <Text
                    //Test fontsize using flexible dimension
                    style={{ color: "#fff", textTransform: "uppercase", fontSize: 16  }}
                >
                    Đăng xuất</Text>
            </TouchableOpacity>
            {
                showUpdate && (
                    <View style={styles.updateContainer}>
                        <Text style={styles.header}>Cập nhật thông tin tài khoản</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.text}>Họ và tên</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={uname}
                                onChangeText={(text) => setFdata({ ...fdata, name: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.text}>Email</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={email}
                                onChangeText={(text) => setFdata({ ...fdata, email: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.text}>Biển số xe</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={plate}
                                onChangeText={(text) => setFdata({ ...fdata, plate: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.text}>Số điện thoại</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={phoneNumber}
                                onChangeText={(text) => setFdata({ ...fdata, phoneNumber: text })}
                            />
                        </View>
                        {
                            errorMsg ? <Text style={{ color: "red", fontSize: RFValue(13), marginTop: 50 }}>{errorMsg}</Text> : null
                        }
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                            setShowUpdate(false)
                            setErrorMsg(null)
                        }}>
                            <Text
                                style={{ color: "#fff", textTransform: "uppercase", fontWeight: "bold" }}
                            >
                                Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.updateBtn} onPress={() => {
                            updateUserInfo();
                            getUserInfo();
                        }}>
                            <Text
                                style={{ color: "#fff", textTransform: "uppercase", fontWeight: "bold" }}
                            >
                                Cập nhật</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%",
        display: 'flex',
        alignItems: 'center'
    },
    infoContainer: {
        width: "100%",
        height: 128,
        backgroundColor: "#2957C2",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20
    },
    ballanceContainer: {
        width: '90%',
        height: 400,
        marginTop: 24,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        padding: 20
    },
    updateContainer: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: '#fff'

    },
    addCashBtn: {
        position: 'absolute',
        width: '90%',
        backgroundColor: "#FFF",
        justifyContent: 'center',
        height: 54,
        bottom: 80,
        marginLeft: 20,
        alignItems: 'center',
        color: "#2957C2",
        borderColor: '#000',
        borderWidth: 1,
    },
    signOutBtn: {
        position: 'absolute',
        width: '90%',
        backgroundColor: "#2957C2",
        justifyContent: 'center',
        height: 54,
        bottom: 20,
        marginLeft: 20,
        alignItems: 'center'
    },
    inputContainer: {
        width: "100%",
        height: "auto",
        padding: 18,
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#979797",
        padding: 10,
        marginTop: 4,
    },
    header: {
        marginTop: 33,
        color: "#2957C2",
        fontSize: 22,
        fontWeight: "bold"
    },
    text: {
        fontSize: RFValue(14),
        color: 'black',
    },
    cancelBtn: {
        position: 'absolute',
        backgroundColor: "#2957C2",
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        height: 44,
        bottom: 74,
    },
    updateBtn: {
        position: 'absolute',
        backgroundColor: "#2957C2",
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        height: 44,
        bottom: 20,
    }
});


export default Profile;