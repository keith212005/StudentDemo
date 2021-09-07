import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

import {responseiveHeight, responsiveWidth} from '@resources';

export default class CustomInput extends Component {
  render() {
    return (
      <TextInput
        style={styles.input}
        placeholderTextColor="black"
        ref={this.props.refName}
        {...this.props}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'black',
    borderRadius: 5,
  },
});
