import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { logoGoogle, lockClosedOutline, mailOutline, mail, lockClosed } from 'ionicons/icons'; 
import { 
  IonContent, 
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner 
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
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
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(12),  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/)]]
    });
    addIcons({mailOutline,mail,lockClosedOutline,lockClosed, logoGoogle});
  }
  getEmailError() {
    const control = this.loginForm.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    }
    if (control?.hasError('email') || control?.hasError('pattern')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
  getPasswordError() {
    const control = this.loginForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 12 characters';
    }
    if (control?.hasError('pattern')) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    return '';
  }
  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        this.router.navigate(['/tabs']);
      } catch (error: any) {
        this.errorMessage = error.message;
        console.error('Login failed:', error);
      } finally {
        this.loading = false;
      }
    }
  }
  async resetPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      this.errorMessage = 'Please enter your email address first';
      return;
    }

    try {
      this.loading = true;
      this.errorMessage = '';
      await this.authService.resetPassword(email);
      this.successMessage = 'Password reset email has been sent. Please check your inbox.';
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Password reset failed:', error);
    } finally {
      this.loading = false;
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
    const password = this.loginForm.get('password')?.value;
    
    // Check requirements
    this.hasMinLength = password?.length >= 12;
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasLowerCase = /[a-z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);
    this.hasSpecialChar = /[!@#$%^&*]/.test(password);

    // Calculate strength
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