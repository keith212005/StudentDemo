import firestore from '@react-native-firebase/firestore';
import storage, {firebase} from '@react-native-firebase/storage';

class FirestoreDb {
  getAllStudentList() {
    return new Promise(async (resolve, reject) => {
      await firestore().collection('Users').onSnapshot(onResult, onError);
    });
  }

  defaultStorageBucket = storage();
  secondaryStorageBucket = firebase
    .app()
    .storage('gs://studentdemo-c9629.appspot.com/Users/Ketan passport pic.jpg');
}

export const firestoreDb = new FirestoreDb();
