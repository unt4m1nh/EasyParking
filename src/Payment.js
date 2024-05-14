import React, { useState, useEffect, useRef } from 'react';
import {
    Text, View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    Modal,
    ScrollView,
} from 'react-native'

import { useUserState } from '../component/UserContext';
import LinearGradient from 'react-native-linear-gradient';

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
        <ScrollView style={styles.container}>
            <Text style={styles.textHeading}>
                Lịch sử đỗ xe của {userContext.name}
            </Text>
            {
                session.map((session, index) => (
                    <View key={index} style={styles.session}>
                        <Text style={styles.textDark}>{session.parking}</Text>
                        <Text style={styles.textDarkRegular}>{session.date === undefined ? 'Null' : session.date}</Text>
                        <Text style={styles.textDarkRegular}>{session.payment === undefined ? 'Null' : session.payment}</Text>
                        <Text style={{
                            ...styles.textDarkRegular,
                            color: session.paymentStatus === 1 ? 'red' : 'green'
                        }}
                        >{session.paymentStatus == 1 ? 'Chưa thanh toán' : 'Đã thanh toán'}
                        </Text>
                        <LinearGradient
                            colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                            style={styles.btn}
                        >    
                        <TouchableOpacity disabled={session.paymentStatus === 1 ? false : true}
                        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} 
                        >
                            <Text style={styles.textLight}>Thanh toán</Text>
                        </TouchableOpacity>
                        </LinearGradient>
                    </View>
                ))
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: 16,
        gap: 16,
    },
    session: {
        width: '90%',
        height: 'auto',
        padding: 8,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    btn: {
        width: 'auto',
        height: 48,
        borderRadius: 10,
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
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: 'Urbanist-Regular',
        color: '#212121',
    },
})

export default Payment;