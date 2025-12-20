import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './config';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();
    return {
      idToken,
      email: user.email,
      name: user.displayName,
    };
  } catch (err) {
    console.error('Error during Google sign-in:', err);
    throw err;
  }
}