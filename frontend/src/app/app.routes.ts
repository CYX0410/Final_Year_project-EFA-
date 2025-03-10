import { Routes } from '@angular/router';
import { initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  }
];

// Initialize Firebase first
const app = initializeApp(environment.firebase);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
});