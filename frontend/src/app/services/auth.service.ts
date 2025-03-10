import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup 
} from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5010/api';

  constructor(
    private auth: Auth,
    private http: HttpClient
  ) {}
  async resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
  async register(email: string, password: string) {
    try {
      // First create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      
      // Then store in MySQL
      await this.http.post(`${this.apiUrl}/users`, {
        uid,
        email,
        password
      }).toPromise();

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const uid = userCredential.user.uid;
      const email = userCredential.user.email;

      // Store Google user in MySQL
      await this.http.post(`${this.apiUrl}/users`, {
        uid,
        email,
        password: null // Google sign in doesn't have password
      }).toPromise();

      return userCredential;
    } catch (error) {
      throw error;
    }
  }
}