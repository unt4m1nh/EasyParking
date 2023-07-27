import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-ionicons';

import MapScreen from './Map';
import QrScreen from './Qr';
import Profile from './Profile';

const BottomNavigator = createBottomTabNavigator();

const mapName = 'Bản đồ';
const qrName = 'QR Code';
const profileName = 'Tài khoản';    

const BottomNavigation = ({navigation}) => (
    <NavigationContainer>
        <BottomNavigator.Navigator
            initialRouteName={mapName}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === mapName) {
                        iconName = focused ? 'map' : 'map-outline'
                    } else if (rn === qrName) {
                        iconName = focused ? 'qr' : 'qr-outline'
                    } else if (rn === profileName) {
                        iconName = focused ? 'profile' : 'profile-outline'
                    }

                    return <Icon name={iconName} size={size} color={color} />
                },
            })}
        >
            <BottomNavigator.Screen name='mapName' component={MapScreen} />
            <BottomNavigator.Screen name='qrName' component={QrScreen} />
            <BottomNavigator.Screen name='profileName' component={Profile} />
        </BottomNavigator.Navigator>
    </NavigationContainer>
);

export default BottomNavigation;