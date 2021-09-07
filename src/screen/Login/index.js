import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';

import {SquareButton, CustomInput, CustomLoader} from '@components';
import {actionCreators} from '@action';
import {styles} from './style';
import {fieldObject} from '@constants';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: fieldObject,
      password: fieldObject,
    };

    this.inputs = new Array(2);
  }

  // hadnle onSubmitEditing method of input box
  onSubmitEditing(number) {
    if (number < 1) {
      this.inputs[number + 1].focus();
    } else {
      this._onSubmit();
    }
  }

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

  _renderCustomInput = (number, key, otherProps) => {
    return (
      <CustomInput
        value={this.state[key].value}
        placeholder={key}
        valueObject={this.state[key]}
        refName={input => (this.inputs[number] = input)}
        onSubmitEditing={() => this.onSubmitEditing(number)}
        onChangeText={value => this.onChangeText(value, key)}
        blurOnSubmit={false}
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
    } else if (error.code === 'auth/user-not-found') {
      Alert.alert(
        'Error',
        'There is no user record corresponding to this identifier. The user may have been deleted.',
      );
    } else if (error.code === 'auth/wrong-password') {
      Alert.alert(
        'Error',
        'The password is invalid or the user does not have a password.',
      );
    } else if (error.code === 'auth/too-many-requests') {
      Alert.alert(
        'Error',
        'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
      );
    }
  }

  _onSubmit() {
    const {username, password} = this.state;
    auth()
      .signInWithEmailAndPassword(username.value, password.value)
      .then(() => {
        this.props.navigation.dispatch(
          CommonActions.reset({index: 0, routes: [{name: 'Home'}]}),
        );
      })
      .catch(error => this.handleError(error));
  }

  _renderSubmit = () => {
    return (
      <View style={{margin: 10}}>
        <SquareButton title="Login" onPress={() => this._onSubmit()} />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.loginText}>Login</Text>
        {this._renderCustomInput(0, 'username')}
        {this._renderCustomInput(1, 'password', {
          secureTextEntry: true,
          blurOnSubmit: true,
        })}
        {this._renderSubmit()}

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Register')}>
          <Text style={{alignSelf: 'center', fontSize: 15}}>New user ?</Text>
        </TouchableOpacity>
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);
