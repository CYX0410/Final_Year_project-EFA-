import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonItem, IonLabel, IonInput, IonButton,
  IonIcon, IonText 
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton,
    IonIcon, IonText
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
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
}