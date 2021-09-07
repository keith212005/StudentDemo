import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {SquareButton, CustomInput, CustomLoader} from '@components';
import {actionCreators} from '@action';
import {styles} from './style';
import {fieldObject} from '@constants';
import {firebaseDb} from '@database';

let urls = null;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: fieldObject,
      name: fieldObject,
      subject1: fieldObject,
      subject2: fieldObject,
      subject3: fieldObject,
      image: fieldObject,
      studentList: [],
      addUpdate: 'Add',
      pic: '',
    };

    this.onResult = this.onResult.bind(this);
    this.onError = this.onError.bind(this);
    this.inputs = new Array(5);
  }

  async componentDidMount() {
    auth().signInAnonymously();
    urls = await storage().ref('Users/Ketan passport pic.jpg').getDownloadURL();

    const subscriber = firestore()
      .collection('students')
      .onSnapshot(this.onResult, this.onError);
    console.log('urls>>>>', urls);
  }

  componentWillUnmount() {}

  resetData() {
    this.setState({
      loading: false,
      updateItem: false,
      id: fieldObject,
      name: fieldObject,
      subject1: fieldObject,
      subject2: fieldObject,
      subject3: fieldObject,
      addUpdate: 'Add',
    });
  }

  componentWillUnmount() {}

  onResult(QuerySnapshot) {
    let response = QuerySnapshot.docs;

    var newList = [];
    response.map((item, index) => {
      var obj = {};
      obj.name = item._data.name;
      obj.sub1 = item._data.sub1;
      obj.sub2 = item._data.sub2;
      obj.sub3 = item._data.sub3;
      newList.push(obj);
    });

    this.setState({studentList: newList, loading: false});
  }

  onError(error) {
    console.error(error);
  }

  // hadnle onSubmitEditing method of input box
  onSubmitEditing(number) {
    if (number < 3) {
      this.inputs[number + 1].focus();
    } else {
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

  _renderCustomInput = (number, key, placeholder, otherProps) => {
    return (
      <CustomInput
        value={this.state[key].value}
        placeholder={placeholder}
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

  addStudent() {
    return new Promise((resolve, reject) => {
      const {name, subject1, subject2, subject3} = this.state;
      firestore()
        .collection('students')
        .add({
          name: name.value,
          sub1: subject1.value,
          sub2: subject2.value,
          sub3: subject3.value,
        })
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  updateStudent() {
    const {name, subject1, subject2, subject3} = this.state;

    return new Promise((resolve, reject) => {
      firestore()
        .collection('students')
        .where('name', '==', name.value)
        .get()
        .then(querySnapshot => {
          querySnapshot.docs[0].ref
            .update({
              name: name.value,
              sub1: subject1.value,
              sub2: subject2.value,
              sub3: subject3.value,
            })
            .then(() => resolve())
            .catch(err => reject());
        })
        .catch(err => reject());
    });
  }

  deleteStudent(name) {
    return new Promise((resolve, reject) => {
      firestore()
        .collection('students')
        .where('name', '==', name)
        .get()
        .then(querySnapshot => {
          querySnapshot.docs[0].ref.delete();
          resolve();
        })
        .catch(() => reject());
    });
  }

  _onAddUpdateStudent(type) {
    switch (type) {
      case 'Add':
        this.setState({loading: true}, () => {
          this.addStudent().then(() => {
            this.setState({loading: false});
          });
        });
        break;
      case 'Update':
        this.setState({loading: true}, () => {
          this.updateStudent().then(() => {
            this.setState({loading: false});
          });
        });
        break;
      default:
    }
  }

  _renderAddUpdate = () => {
    return (
      <View
        style={{
          margin: 10,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Button
          title={this.state.addUpdate}
          onPress={() => this._onAddUpdateStudent(this.state.addUpdate)}
        />

        {this.state.addUpdate == 'Update' && (
          <Button title="Clear" onPress={() => this.resetData()} />
        )}
      </View>
    );
  };

  onPressItem(item, index) {
    var state_object = {
      addUpdate: 'Update',
      name: {
        ...this.state['name'],
        value: item.name,
      },
      subject1: {
        ...this.state['subject1'],
        value: item.sub1,
      },
      subject2: {
        ...this.state['subject2'],
        value: item.sub2,
      },
      subject3: {
        ...this.state['subject3'],
        value: item.sub3,
      },
    };
    this.setState(state_object);
  }

  getTotalAndPercentage(item) {
    let total = parseInt(item.sub1) + parseInt(item.sub2) + parseInt(item.sub3);
    let percentage = total / 3;
    return {total: total, percentage: percentage};
  }

  _renderFlatListItem = (item, index) => {
    const {total, percentage} = this.getTotalAndPercentage(item);

    return (
      <>
        <View style={{borderWidth: 0.5, borderColor: 'black', marginTop: 5}} />
        <Pressable
          style={{marginTop: 15, flexDirection: 'row'}}
          onPress={() => this.onPressItem(item, index)}>
          <View style={{flex: 5}}>
            <Text style={{fontSize: 20}}>{'Name: ' + item.name}</Text>
            <Text style={{fontSize: 20}}>{'Subject 1:  ' + item.sub1}</Text>
            <Text style={{fontSize: 20}}>{'Subject 2:  ' + item.sub2}</Text>
            <Text style={{fontSize: 20}}>{'Subject 3:  ' + item.sub3}</Text>
            <Text style={{fontSize: 20}}>{'Total:  ' + total}</Text>
            <Text style={{fontSize: 20}}>
              {'Percentage:  ' + percentage.toFixed(2) + ' %'}
            </Text>
          </View>
          <View>
            <SquareButton
              title="Delete"
              onPress={() => {
                this.setState({loading: true}, () => {
                  this.deleteStudent(item.name).then(() => {
                    this.setState({loading: false});
                    this.resetData();
                  });
                });
              }}
            />
          </View>
        </Pressable>
      </>
    );
  };

  _renderStudentList = () => {
    return (
      <>
        {this.state.loading && <CustomLoader />}

        <FlatList
          data={this.state.studentList}
          renderItem={({item, index}) => this._renderFlatListItem(item, index)}
          bounces={false}
          keyExtractor={(item, index) => `${item.name + index}`}
          showsVerticalScrollIndicator={false}
        />
      </>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={{uri: urls}}
          style={{height: 100, width: 100, alignSelf: 'center'}}
        />
        <Text style={styles.loginText}>Enter Student Details</Text>
        {this._renderCustomInput(0, 'name', 'Student name')}
        {this._renderCustomInput(1, 'subject1', 'Subject 1 marks', {
          keyboardType: 'numeric',
          maxLength: 3,
        })}
        {this._renderCustomInput(2, 'subject2', 'Subject 2 marks', {
          keyboardType: 'numeric',
          maxLength: 3,
        })}
        {this._renderCustomInput(3, 'subject3', 'Subject 3 marks', {
          keyboardType: 'numeric',
          maxLength: 3,
          blurOnSubmit: true,
        })}
        {this._renderAddUpdate()}
        {this._renderStudentList()}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state, props) {
  return {counter: state.counter.count};
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Home);
