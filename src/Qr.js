import React, { useState, useEffect, useContext } from 'react';
import {
    Text, View,
    StyleSheet,
    useColorScheme
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { useUserState } from '../component/UserContext';

function QrScreen({ navigation }) {

    const theme = useColorScheme();

    const { userContext, setUserContext } = useUserState();

    const [qrData, setQRData] = useState('1');
    const [showQrCode, setShowQrCode] = useState(false)

    const testData = [
        {
            id: 1,
            prop: "Tên",
            value: "Nguyễn Văn A"
        }, {
            id: 2,
            prop: "Phương tiện",
            value: "Lexus RX350"
        }, {
            id: 3,
            prop: "Bãi đỗ xe",
            value: "Landmark 72"
        }, {
            id: 4,
            prop: "Vị tí ô đỗ",
            value: "A05"
        }, {
            id: 5,
            prop: "Thời gian",
            value: "4 tiéng"
        }, {
            id: 6,
            prop: "Ngày",
            value: "22/12/2022"
        }, {
            id: 7,
            prop: "Giờ",
            value: "09.00 - 13.00"
        }, {
            id: 8,
            prop: "Điện thoại",
            value: "0123456789"
        }
    ]

    console.log('Đây là User State: ', userContext);

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return userContext.idUser + result;

    }

    const generateQRCode = () => {
        const data = generateRandomString(10);
        const qrCode = 'ndd12345' + data
        setQRData(qrCode);
        setShowQrCode(true);
    }

    useEffect(() => {
        if (userContext.booking === 0) {
            generateQRCode();
        }
    }, [userContext]);

    return (
        <View style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme == 'dark' ? '#000' : 'white',
            width: '100%',
            height: '100%',
        }}>
            {
                !showQrCode ? (
                    <Text>Mã QR chỉ có thể tạo khi bạn đã đặt chỗ</Text>
                ) : (
                    <View style={styles.container}>
                        <Text style={styles.text}>Hãy đưa mã QR này trước máy Scan
                            ở cửa ra vào bãi xe</Text>
                        <View style={styles.qr}>
                            <QRCode value={qrData} size={256} />
                        </View>
                        <View style={styles.infoContainer}>
                            {
                                testData.map((data) => (
                                    <View key={data.id} style={styles.info}>
                                        <Text style={styles.text}>{data.prop}</Text>
                                        <Text style={styles.textBold}>{data.value}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: '#EEEEEE',
        alignItems: 'center',
        padding: 16,
    },
    qr: {
        marginTop: 16,
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        maxWidth: 200,
        fontSize: 14,
        fontFamily: 'Urbanist-Regular',
        textAlign: 'center',
        color: '#212121'
    },
    textBold: {
        fontSize: 16,
        fontFamily: 'Urbanist-Regular',
        textAlign: 'center',
        color: '#212121',
        fontWeight: 'bold',
    },
    infoContainer: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
    },
    info: {
        width: 117,
        alignItems: 'flex-start',
    }

});


export default QrScreen;