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
  private apiUrl = 'http://13.229.116.113:5010/api';
  private authStateReady = false;
  
  constructor(
    private auth: Auth,
    private http: HttpClient
  ) {
     // Listen to auth state changes
     this.auth.onAuthStateChanged((user) => {
      this.authStateReady = true;
      console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
    });
  }
  async getCurrentUser(): Promise<User | null> {
    // Wait for auth state to be ready
    if (!this.authStateReady) {
      await new Promise(resolve => {
        const unsubscribe = this.auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user);
        });
      });
    }
    return this.auth.currentUser;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
        const user = await this.getCurrentUser();
        if (!user?.email) {
            console.error('No user found or email missing');
            throw new Error('Please log in again to change your password');
        }

        // First re-authenticate
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
        } catch (error) {
            console.error('Re-authentication failed:', error);
            throw new Error('Current password is incorrect');
        }

        // Update Firebase password first
        try {
            await updatePassword(user, newPassword);
        } catch (firebaseError) {
            console.error('Firebase password update failed:', firebaseError);
            throw firebaseError;
        }

        // Then update MySQL password
        try {
            const response = await this.http.put(`${this.apiUrl}/users/password/${user.uid}`, {
                password: newPassword
            }).toPromise();
            
            console.log('MySQL password update response:', response);
            
            if (!response) {
                throw new Error('No response from database');
            }
        } catch (mysqlError) {
            console.error('MySQL password update failed:', mysqlError);
            // If MySQL fails, we need to rollback Firebase password
            try {
                await updatePassword(user, currentPassword);
            } catch (rollbackError) {
                console.error('Failed to rollback Firebase password:', rollbackError);
            }
            throw new Error('Failed to update password in database');
        }

    } catch (error: any) {
        console.error('Change password error:', error);
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