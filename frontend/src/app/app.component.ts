import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertController, MenuController } from '@ionic/angular/standalone';
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
  IonMenuButton,
  IonAlert,
  IonButtons,
  IonButton
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { addIcons } from 'ionicons';
import { 
  language, 
  notifications, 
  moon, 
  chatbox, 
  logOut,
  settings,
  arrowBackOutline
} from 'ionicons/icons';

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
    IonMenuButton,
    IonAlert,
    IonButtons,
    IonButton
  ],
})
export class AppComponent {
  notificationsEnabled = true;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private menuController: MenuController
  ) {
    addIcons({ 
      language, 
      notifications, 
      moon, 
      chatbox, 
      logOut,
      settings,
      arrowBackOutline
    });
  }

  async closeMenu() {
    await this.menuController.close();
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
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Yes',
          handler: async () => {
            try {
              await this.menuController.close(); // Close menu first
              await this.authService.signOut();
              this.router.navigate(['/login']);
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
}