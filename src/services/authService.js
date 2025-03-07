import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail 
  } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { auth, firestore } from './firebaseConfig';
  
  export const registerUser = async (email, password, name, userType) => {
    try {
      // Kullanıcı oluşturma
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Kullanıcı bilgilerini Firestore'a kaydetme
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: name,
        userType: userType,
        createdAt: new Date(),
        profileCompleted: false
      });
  
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw error;
    }
  };