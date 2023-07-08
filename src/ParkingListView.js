import {
    Text, View,
    StyleSheet,
    Button,
} from 'react-native'



function ParkingListView({navigation}) {
    return (
        <View style={styles.background}>
            <Text style={styles.text}>This is ParkingListView</Text>
            <Button
                title="Select"
                onPress={() =>
                    navigation.navigate('MapView')
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    },
    text: {
        fontSize: 30,
        color: 'black'
    }
});


export default ParkingListView;