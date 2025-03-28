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
  User,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  bio: string;
  preferences: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://54.179.34.214:5010/api';

  
  constructor(
    private auth: Auth,
    private http: HttpClient
  ) {}
  async getCurrentUser(): Promise<User | null> {
    return this.auth.currentUser;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (!user || !user.email) throw new Error('No user logged in');

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Change password
      await updatePassword(user, newPassword);
    } catch (error: any) {
      console.error('Change password error:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect');
      }
      throw error;
    }
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
  getUserProfile(uid: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/users/profile/${uid}`);
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