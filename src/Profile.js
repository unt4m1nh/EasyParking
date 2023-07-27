import React from 'react';
import {
    Text, View,
    StyleSheet,
    Button,
    TextInput
} from 'react-native'

function Profile({navigation}) {

    return (
        <View style={styles.background}>
            <Text style={styles.text}>Profile Tab</Text>
        </View>
    )
}

const styles = StyleSheet.create({
   background: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
   }
});


export default Profile;