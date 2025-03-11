import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  updateProfile,
  User
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
  async getCurrentUser(): Promise<User | null> {
    return this.auth.currentUser;
  }

  async updateUserProfile(profileData: any) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('No user logged in');

      // Update Firebase profile
      await updateProfile(user, {
        displayName: profileData.username
      });

      // Update MySQL profile
      await this.http.put(`${this.apiUrl}/users/profile/${user.uid}`, {
        username: profileData.username,
        email: user.email,
        bio: profileData.bio,
        preferences: profileData.preferences
      }).toPromise();

    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
  async getUserProfile(uid: string) {
    try {
      const response = await this.http.get(`${this.apiUrl}/users/profile/${uid}`).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

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