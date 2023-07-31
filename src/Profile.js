import React from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput,
    Image
} from 'react-native'

function Profile({navigation}) {

    return (
        <View style={styles.background}>
            <View style={styles.infoContainer}>
                <Image
                    style={{marginLeft: 40}}
                    source={require('./img/user.png')} 
                 />
                <View>
                    <Text style={{color: "#FFF"}}>Xin chào !</Text>
                    <Text style={{color: "#FFF", fontSize: 20}}>Hoàng Gia Minh</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
   background: {
        width: "100%",
        height: "100%",
   },
   infoContainer: {
        width: "100%",
        height: 128,
        backgroundColor: "#2957C2",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20
   }
});


export default Profile;