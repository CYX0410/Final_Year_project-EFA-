import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { addIcons } from 'ionicons';
import { logoGoogle, lockClosedOutline, mailOutline, mail, lockClosed  } from 'ionicons/icons'; 
import { 
  IonContent,
  IonItem, IonLabel, IonInput, IonButton,
  IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonSpinner, 
    CommonModule,
    ReactiveFormsModule, RouterLink,
    IonContent, IonItem, IonLabel, IonInput, IonButton,
    IonIcon
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  hasMinLength = false;
  hasUpperCase = false;
  hasLowerCase = false;
  hasNumber = false;
  hasSpecialChar = false;
  passwordStrength = 0;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  )
  {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6),   Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/)]]
    });
    addIcons({mailOutline, mail,lockClosedOutline,lockClosed, logoGoogle});
  }
  getEmailError() {
    const control = this.registerForm.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    }
    if (control?.hasError('email') || control?.hasError('pattern')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
  async onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      try {
        const { email, password } = this.registerForm.value;
        await this.authService.register(email, password);
        this.router.navigate(['/login']);
      } catch (error: any) {
        this.errorMessage = error.message;
        console.error('Registration failed:', error);
      } finally {
        this.loading = false;
      }
    }
  }

  async signInWithGoogle() {
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/tabs']);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Google sign in failed:', error);
    } finally {
      this.loading = false;
    }
  }
  onPasswordInput() {
    const password = this.registerForm.get('password')?.value;
    
    this.hasMinLength = password?.length >= 12;
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasLowerCase = /[a-z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);
    this.hasSpecialChar = /[!@#$%^&*]/.test(password);

    const requirements = [
      this.hasMinLength,
      this.hasUpperCase,
      this.hasLowerCase,
      this.hasNumber,
      this.hasSpecialChar
    ];
    
    this.passwordStrength = (requirements.filter(Boolean).length / requirements.length) * 100;
  }
}