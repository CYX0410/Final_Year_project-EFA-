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
  arrowBackOutline,
  keyOutline, informationCircle } from 'ionicons/icons';

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
    addIcons({arrowBackOutline,language,notifications,moon,chatbox,logOut,keyOutline,informationCircle,settings});
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'true';
      this.applyTheme(this.isDarkMode);
    }
  }

  async closeMenu() {
    await this.menuController.close();
  }
  async aboutEFA() {
    await this.menuController.close();
    this.router.navigate(['/about-efa']);
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
  this.applyTheme(this.isDarkMode);
  // Save preference
  localStorage.setItem('darkMode', this.isDarkMode.toString());
}

private applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('ion-palette-dark');
  } else {
    document.documentElement.classList.remove('ion-palette-dark');
  }
}
  provideFeedback() {
    // Implement feedback logic
    console.log('Provide feedback clicked');
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Change Password',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Current Password',
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'New Password (min 12 characters)',
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirm New Password',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Change',
          handler: async (data) => {
            if (data.newPassword !== data.confirmPassword) {
              this.showError('New passwords do not match');
              return false;
            }
            
            // Password validation
            if (data.newPassword.length < 12) {
              this.showError('Password must be at least 12 characters');
              return false;
            }
            if (!/[A-Z]/.test(data.newPassword)) {
              this.showError('Password must contain at least one uppercase letter');
              return false;
            }
            if (!/[a-z]/.test(data.newPassword)) {
              this.showError('Password must contain at least one lowercase letter');
              return false;
            }
            if (!/[0-9]/.test(data.newPassword)) {
              this.showError('Password must contain at least one number');
              return false;
            }
            if (!/[!@#$%^&*]/.test(data.newPassword)) {
              this.showError('Password must contain at least one special character (!@#$%^&*)');
              return false;
            }
  
            try {
              await this.authService.changePassword(data.currentPassword, data.newPassword);
              this.showSuccess('Password changed successfully');
              await this.menuController.close();
              return true;
            } catch (error: any) {
              this.showError(error.message || 'Failed to change password');
              return false;
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  private async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async showSuccess(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
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