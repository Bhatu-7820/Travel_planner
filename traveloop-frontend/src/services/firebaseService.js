import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const firebaseService = {
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      
      // The signed-in user info.
      const user = result.user;
      
      // Get the ID token to send to the backend
      const idToken = await user.getIdToken();
      
      return { user, idToken };
    } catch (error) {
      console.error('Firebase Google Login Error:', error);
      throw error;
    }
  }
};
