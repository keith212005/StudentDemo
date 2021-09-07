import firestore from '@react-native-firebase/firestore';

class FirestoreDb {
  getAllStudentList() {
    return new Promise(async (resolve, reject) => {
      await firestore().collection('Users').onSnapshot(onResult, onError);
    });
  }
}

export const firestoreDb = new FirestoreDb();
