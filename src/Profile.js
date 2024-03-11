import React, { useState, useEffect } from 'react';
import {
    Text, View,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../component/context';
import { useUserState } from '../component/UserContext';
function Profile({ navigation }) {

    const { signOut } = React.useContext(AuthContext);
    const [token, setToken] = useState(null);
    const { userContext, setUserContext } = useUserState();
    const [showUpdate, setShowUpdate] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const retrieveToken = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            return authToken;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    retrieveToken().then((storedToken) => {
        if (storedToken) {
            // Use the stored token for authentication
            setToken(storedToken);
        } else {
            // Token not available or retrieval failed
        }
    });

    const deleteToken = async (storedToken) => {
        try {
            await AsyncStorage.removeItem(storedToken);
            console.log('Item deleted successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    } 

    const updateUserInfo = () => {
        if (userContext.email === '' && userContext.name === '' && userContext.phoneNumber === '' && userContext.plate === '') {
            setMessageType('Lỗi');
            setMessage('Bạn cần nhập đủ thông tin');
            setModalVisible(true);
        } else {
            var raw = JSON.stringify({
                "name": userContext.name,
                "email": userContext.email,
                "phoneNumber": userContext.phoneNumber,
                "plate": userContext.plate,
            })

            var requestOptions = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: raw
            };

            fetch(`${process.env.LOCAL_IP_URL}/update/${userContext.idUser}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setShowUpdate(false);
                    setMessageType('Thông báo');
                    setMessage(result.message);
                    setModalVisible(true);
                })
                .catch(error => console.log('error', error));
        }
    }


    return (
        <View style={styles.background}>
            {
                !showUpdate ?
                    <View>
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
                        <View style={styles.infoContainer}>
                            <View style={styles.header}>
                                <Text style={styles.textTitle}>Hồ sơ cá nhân</Text>
                            </View>
                            <View style={styles.info}>
                                <View>
                                    <Image
                                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Mohamed_Salah_2021_CAN_Final.jpg' }}
                                        style={styles.avatar}
                                    ></Image>
                                </View>
                                <Text style={styles.textTitle}>{userContext !== null ? userContext.name : 'Lỗi rồi'}</Text>
                                <Text style={styles.textSmall}>{userContext !== null ? userContext.email : 'Lỗi rồi'}</Text>
                            </View>
                            <View style={styles.settings}>
                                <TouchableOpacity style={styles.option}
                                    onPress={() => {
                                        setShowUpdate(!showUpdate);
                                    }}>
                                    <Image
                                        source={require("../assets/icons/profile-user.png")}
                                        style={styles.icon}
                                    ></Image>
                                    <Text style={styles.textLarge}>Chỉnh sửa hồ sơ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.option}>
                                    <Image
                                        source={require("../assets/icons/profile-wallet.png")}
                                        style={styles.icon}
                                    ></Image>
                                    <Text style={styles.textLarge}>Thanh toán</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.option}>
                                    <Image
                                        source={require("../assets/icons/profile-notification.png")}
                                        style={styles.icon}
                                    ></Image>
                                    <Text style={styles.textLarge}>Thông báo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.option}>
                                    <Image
                                        source={require("../assets/icons/profile-security.png")}
                                        style={styles.icon}
                                    ></Image>
                                    <Text style={styles.textLarge}>Bảo mật</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.option}>
                                    <Image
                                        source={require("../assets/icons/profile-help.png")}
                                        style={styles.icon}
                                    ></Image>
                                    <Text style={styles.textLarge}>Trợ giúp</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.option} onPress={() => {
                                    signOut();
                                    deleteToken(token);
                                }}>
                                    <Image
                                        source={require("../assets/icons/profile-logout.png")}
                                        style={styles.icon}
                                    ></Image>
                                    <Text style={styles.textLargeRed}>Đăng xuất</Text>
                                </TouchableOpacity>
                            </View>
                            <Modal
                                animationType='slide'
                                transparent={true}
                                visible={showConfirmPopup}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setShowConfirmPopup(!showConfirmPopup);
                                }}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.textDark}>Đăng xuất</Text>
                                        <Text style={styles.textDarkRegular}>Bạn có chắc chắn muốn đăng xuất ?</Text>
                                        <LinearGradient
                                            colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                                            style={styles.closeBtn}
                                        >
                                            <TouchableOpacity
                                                onPress={() => setModalVisible(!modalVisible)}
                                                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Text style={styles.textLight}>
                                                    Có, Đăng xuất</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </View> :
                    <View>
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
                        <View style={styles.infoContainer}>
                            <View style={styles.header}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowUpdate(false);
                                    }}
                                >
                                    <Image
                                        source={require("../assets/icons/arrow-left.png")}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.textTitle}>Cập nhật hồ sơ cá nhân</Text>
                            </View>
                            <View style={styles.updateForm}>
                                <TextInput
                                    style={styles.input}
                                    defaultValue={userContext.name}
                                    onChangeText={(text) => setUserContext({...userContext, name: text})}
                                />
                                <TextInput
                                    style={styles.input}
                                    defaultValue={userContext.email}
                                    onChangeText={(text) => setUserContext({...userContext, email: text})}
                                />
                                <TextInput
                                    style={styles.input}
                                    defaultValue={userContext.plate}
                                    onChangeText={(text) => setUserContext({...userContext, plate: text})}
                                />
                                <TextInput
                                    style={styles.input}
                                    defaultValue={userContext.phoneNumber}
                                    onChangeText={(text) => setUserContext({...userContext, phoneNumber: text})}
                                />
                            </View>
                        </View>
                        <LinearGradient
                            colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                            style={styles.updateBtn}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    updateUserInfo();
                                }}
                                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={styles.textLight}>
                                    Cập nhật hồ sơ</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%",
        display: 'flex',
        backgroundColor: '#fff',
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
        marginTop: 24,
        paddingLeft: 24,
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
    },
    infoContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 24
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settings: {
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        padding: 24,
        borderTopWidth: 1,
        borderColor: '#FAFAFA'
    },
    option: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
    updateForm: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    input: {
        width: "90%",
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
    closeBtn: {
        width: '100%',
        height: 48,
        borderRadius: 10,
    },
    updateBtn: {
        position: 'fixed',
        left: '5%',
        bottom: '15%',
        width: '90%',
        height: 48,
        borderRadius: 10,
    },
    icon: {
        width: 28,
        height: 28,
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 9999
    },
    textTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212121'
    },
    textLarge: {
        fontSize: 18,
        color: '#424242',
        fontWeight: '600',
    },
    textLargeRed: {
        fontSize: 18,
        color: '#F75555',
        fontWeight: '600',
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
    textSmall: {
        fontSize: 14,
        color: '#212121'
    },

});


export default Profile;

