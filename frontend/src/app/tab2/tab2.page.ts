import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonInput,
  IonTextarea, IonSelect, IonSelectOption,
  IonAvatar, IonButton, IonIcon, IonButtons,
  IonText 
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { createOutline, checkmarkOutline } from 'ionicons/icons';

interface PreferenceOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonInput,
    IonTextarea, IonSelect, IonSelectOption,
    IonAvatar, IonButton, IonIcon, IonButtons,
    IonText
  ]
})
export class Tab2Page implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userPhotoURL: string | null = null;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    addIcons({ createOutline, checkmarkOutline });

    this.profileForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      preferences: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }
  get username(): string {
    return this.profileForm.get('username')?.value || '';
  }

  get email(): string {
    return this.profileForm.get('email')?.value || '';
  }
  async loadUserProfile() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        this.userPhotoURL = user.photoURL;
        
        this.authService.getUserProfile(user.uid).subscribe({
          next: (profile) => {
            this.profileForm.patchValue({
              username: profile?.username || user.displayName || '',
              email: user.email || '',
              bio: profile?.bio || '',
              preferences: profile?.preferences || ''
            });
          },
          error: (error) => {
            console.warn('Profile not found, using default values:', error);
            this.profileForm.patchValue({
              username: user.displayName || '',
              email: user.email || '',
              bio: '',
              preferences: ''
            });
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      this.errorMessage = 'Failed to load profile';
    }
  }

  editProfile() {
    this.isEditing = true;
  }

  async saveProfile() {
    if (this.profileForm.valid) {
      try {
        await this.authService.updateUserProfile(this.profileForm.value);
        this.isEditing = false;
        this.errorMessage = '';
      } catch (error) {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Failed to update profile';
      }
    }
  }
}