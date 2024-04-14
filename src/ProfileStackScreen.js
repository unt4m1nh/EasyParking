import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from './Profile';
import Payment from './Payment';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = ({navigation}) => (
    <ProfileStack.Navigator headerMode='none'>
        <ProfileStack.Screen name="ProfileScreen" component={Profile} options={{headerShown: false}}/>
        <ProfileStack.Screen name="PaymentScreen" component={Payment} options={{headerShown: false}}/>
    </ProfileStack.Navigator>
);

export default ProfileStackScreen;