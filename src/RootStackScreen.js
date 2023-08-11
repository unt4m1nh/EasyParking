import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Login';
import SignUp from './SignUp';

const RootStack = createNativeStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="LoginScreen" component={Login}/>
        <RootStack.Screen name="SignUpScreen" component={SignUp}/>
    </RootStack.Navigator>
);

export default RootStackScreen;