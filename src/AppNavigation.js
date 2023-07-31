import React, { Fragment, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'

import Login from './Login';
import ParkingListView from './ParkingListView';
import RootStackScreen from './RootStackScreen';

import { AuthContext } from '../component/context';

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
  //const [loginState, setLoginState] = useState(false);
  //const [currentUser, setCurrentUser] = useState(null);
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: () => {
      setUserToken('abcxyz');
      console.log('signIN');
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
              })}
            >
              <BottomNavigator.Screen name={mapName} component={MapScreen} />
              <BottomNavigator.Screen name={qrName} component={QrScreen} />
              <BottomNavigator.Screen name={profileName} component={Profile} />
            </BottomNavigator.Navigator>
          ) :
          <RootStackScreen />
        }
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default AppNavigator