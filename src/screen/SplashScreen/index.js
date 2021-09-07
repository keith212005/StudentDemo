import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {CommonActions} from '@react-navigation/native';

import {styles} from './style';

export const SplashScreen = props => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: 'Login'}]}),
      );
    }, 2000);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash Screen</Text>
    </View>
  );
};
