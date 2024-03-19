import React, { useState, useEffect, useRef } from 'react';
import {
    Text, View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    Image,
    Modal
} from 'react-native'
//import { useCameraPermission, useCameraDevice, Camera } from 'react-native-vision-camera';
import LinearGradient from 'react-native-linear-gradient';

import { io } from "socket.io-client"


function CameraScreen({ navigation }) {
    // Hooks API granting CAMERA permission
    //const { hasPermission, requestPermission } = useCameraPermission();
    // Setting up device camera
    //const device = useCameraDevice('back');
    // if (device == null) return <NoCameraDeviceError />

    const cameraRef = useRef(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const theme = useColorScheme();

    // Request Camera Permission from Android system
    // useEffect(() => {
    //     if (!hasPermission) {
    //         requestPermission();
    //     }
    // }, [hasPermission]);

    // Connect socket
    useEffect(() => {
        // Socket variables
        const socket = io(process.env.SOCKET_IP);

        return () => {
            if (socket) {
                socket.disconnect();
            }
        }
    }, []);

    // Function to send video data
    // const sendVideoData = async () => {
    //     if (cameraRef.current) {
    //         // Capture image from camera
    //         const options = { quality: 0.5, base64: true };
    //         const data = await cameraRef.current.takePhoto(options);

    //         // Send image data to server
    //         if (socket) {
    //             socket.emit('Hello');
    //             socket.emit('image', data.base64);
    //         }
    //     }
    // }

    // const frameProcessor = useFrameProcessor(frame => {
    //     'worklet'
    //     console.log('A new frame arrived')
    //     //console.log(`Frame: ${frame.width} ${frame.height} ${frame.pixelFormat}`);
    // }, [])


    // if (!device) {
    //     return (
    //         <Text>Device Camera Not Found !</Text>
    //     )
    // }

    return (
        <View style={styles.background}>
            {/* Camera View */}
        

            {/* Modal View */}
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
export default CameraScreen;