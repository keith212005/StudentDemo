import React, {Component} from 'react';
import {View, Text, Button, TextInput, Pressable, Alert} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';

import {SquareButton, CustomInput} from '@components';
import {actionCreators} from '@action';
import {styles} from './style';
import {fieldObject} from '@constants';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: fieldObject,
      password: fieldObject,
    };
  }

  componentDidMount() {}

  // handle onChangeText method of input box
  onChangeText(value, key) {
    const object = {};
    object[key] = {
      value: value,
      isError: false,
      errorText: '',
      isFocus: true,
    };
    this.setState(prevState => ({...object}));
  }

  _renderCustomInput = (index, key, otherProps) => {
    return (
      <CustomInput
        onChangeText={value => this.onChangeText(value, key)}
        value={this.state[key].value}
        placeholder={key}
        valueObject={this.state[key]}
        {...otherProps}
      />
    );
  };

  handleError(error) {
    console.log(error);
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('Error', 'That email address is already in use!');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Error', 'That email address is invalid!');
    } else if (error.code === 'auth/weak-password') {
      Alert.alert('Error', 'Password should be atlease 6 characters long.');
    }
  }

  _onSubmit() {
    console.log('Submit pressed');

    const {username, password} = this.state;
    auth()
      .createUserWithEmailAndPassword(username.value, password.value)
      .then(() => {
        console.log('User account created & signed in!');

        Alert.alert(
          'Success',
          'User account created succesfully.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                this.props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                  }),
                );
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch(error => this.handleError(error));
  }

  _renderSubmit = () => {
    return (
      <View style={{margin: 10}}>
        <SquareButton title="Submit" onPress={() => this._onSubmit()} />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.loginText}>Register</Text>
        {this._renderCustomInput(0, 'username')}
        {this._renderCustomInput(1, 'password', {
          secureTextEntry: true,
          blurOnSubmit: true,
        })}
        {this._renderSubmit()}
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  console.log('store>>', state);
  return {counter: state.counter.count};
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Register);
