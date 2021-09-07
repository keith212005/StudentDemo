import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import {responsiveHeight, responsiveWidth} from '@resources';

export default class CustomLoader extends Component {
  render() {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    opacity: 0.5,
  },
});
