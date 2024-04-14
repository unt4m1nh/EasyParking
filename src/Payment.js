import React, { useState, useEffect, useRef } from 'react';
import {
    Text, View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    Modal,
} from 'react-native'

import { useUserState } from '../component/UserContext';

function Payment({ navigation }) {

    const { userContext, setUserContext } = useUserState();
    const [session, setSession] = useState([]);

    // function to fetch session data
    const sessionData = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`${process.env.API_URL}/getAllSession/${userContext.idUser}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                setSession(result)
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        sessionData();
    }, [userContext]);

    return (
        <View style={styles.container}>
            <Text style={styles.textDarkRegular}>
                Lịch sử đỗ xe của {userContext.name}
            </Text>
            {
                session.map((session, index) => {
                    <View key={index}>
                        <Text style={textDark}>{session.parking}</Text>
                        <Text style={textDarkRegular}>{session.date}</Text>
                        <Text style={textDarkRegular}>{session.payment}</Text>
                        <Text style={{
                            ...styles.textDarkRegular,
                            color: session.paymentStatus === 1 ? 'red' : 'green'
                        }}
                        >{session.paymentStatus == 1 ? 'Chưa thanh toán' : 'Đã thanh toán'}
                        </Text>
                        <TouchableOpacity disabled={session.paymentStatus === 1 ? false : true} >
                            <Text>Thanh toán</Text>
                        </TouchableOpacity>
                    </View>
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        position: 'absolute',
        left: '30%',
        top: '80%',
        width: '40%',
        height: 50,
        backgroundColor: 'red',
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
})

export default Payment;