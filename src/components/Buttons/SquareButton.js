import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

export default class SquareButton extends React.PureComponent {
  render(props) {
    return <Button title={this.props.title} onPress={this.props.onPress} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
