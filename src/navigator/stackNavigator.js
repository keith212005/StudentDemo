import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';

import * as Screen from '@screen';

const Stack = createStackNavigator();

export default class StackNavigator extends Component {
  _addScreen = (routeName, isNavigator = false, extraProps = {}) => {
    return <Stack.Screen name={routeName} component={Screen[routeName]} />;
  };

  render() {
    return (
      <>
        <StatusBar />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{
              headerShown: false,
              gesturesEnabled: false,
              animationEnabled: false,
            }}>
            {this._addScreen('SplashScreen')}
            {this._addScreen('Login')}
            {this._addScreen('Home')}
            {this._addScreen('Register')}
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
