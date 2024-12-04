import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import MainScreen from './Screens/MainScreen';
import ActionsPage from './Screens/ActionsPage';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="MainScreen">
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ActionsPage"
        component={ActionsPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default MyStack;
