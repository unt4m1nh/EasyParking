import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParkingListView from './ParkingListView';
import MapScreen from './Map';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="MapView"
                    component={MapScreen}
                />
                <Stack.Screen name="ParkingListView" component={ParkingListView} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator