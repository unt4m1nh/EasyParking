import React, { Fragment, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'

import RootStackScreen from './RootStackScreen';

import { AuthContext } from '../component/context';
import { TranslatorProvider } from 'react-native-translator'

import MapScreen from './Map';
import QrScreen from './Qr';
import Profile from './Profile';

const BottomNavigator = createBottomTabNavigator();

const mapName = 'Bản đồ';
const qrName = 'QR Code';
const profileName = 'Tài khoản';

function AppNavigator() {
  const [userToken, setUserToken] = React.useState(null);
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: () => {
      setUserToken('abcxyz');
      console.log('signIN');
      console.log(userToken);
    },
    signOut: () => {
      setUserToken(null);
      console.log('Đăng xuất');
      console.log(userToken);
    }
  }));
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken !== null ?
          (
            <BottomNavigator.Navigator
              initialRouteName={mapName}
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  let colorName;
                  let rn = route.name;

                  if (rn === mapName) {
                    iconName = focused ? "map" : "map"
                    colorName = focused ? "#2957C2" : "#b7bbc3"
                  } else if (rn === qrName) {
                    iconName = focused ? "qrcode" : "qrcode"
                    colorName = focused ? "#2957C2" : "#b7bbc3"
                  } else if (rn === profileName) {
                    iconName = focused ? "user" : "user"
                    colorName = focused ? "#2957C2" : "#b7bbc3"
                  }

                  return <Icon name={iconName} size={25} color={colorName} />
                },
                tabBarLabel: ({ focused }) => (
                  <Text style={{ color: focused ? '#2957c2' : 'grey', fontSize: 10 }}>
                    {route.name}
                  </Text>
                )
              })}
            >
              <BottomNavigator.Screen name={mapName} component={MapScreen} options={{ headerShown: false }} />
              <BottomNavigator.Screen name={qrName} component={QrScreen} options={{ headerShown: false }} />
              <BottomNavigator.Screen name={profileName} component={Profile} options={{ headerShown: false }} />
            </BottomNavigator.Navigator>
          ) :
          <RootStackScreen />
        }
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default AppNavigator