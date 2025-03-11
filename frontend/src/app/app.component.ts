import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  IonApp, 
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonToggle,
  IonMenuButton
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { addIcons } from 'ionicons';
import { 
  languageOutline, 
  notificationsOutline, 
  moonOutline, 
  chatboxOutline, 
  logOutOutline,
  settingsOutline 
} from 'ionicons/icons';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonApp, 
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonToggle,
    IonMenuButton
  ],
})
export class AppComponent {
  notificationsEnabled = true;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ 
      languageOutline, 
      notificationsOutline, 
      moonOutline, 
      chatboxOutline, 
      logOutOutline,
      settingsOutline 
    });
  }

  changeLanguage() {
    // Implement language change logic
    console.log('Change language clicked');
  }

  toggleNotifications() {
    // Implement notifications toggle logic
    console.log('Notifications:', this.notificationsEnabled);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  provideFeedback() {
    // Implement feedback logic
    console.log('Provide feedback clicked');
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}