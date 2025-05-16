import { Component } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ChallengeService, ChallengeProgress } from './services/challenge.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, MenuController, IonItemGroup, IonBadge } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { EcoCalendarService } from './services/eco-calendar.service';
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
  keyOutline, informationCircle, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonBadge, IonItemGroup, 
    CommonModule,
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
    IonButtons,
    IonButton
  ],
})
export class AppComponent {
  notificationsEnabled = false;
  upcomingEventsCount = 0;  // Add this property
  hasUpcomingEvents = false;
  private apiUrl = 'http://localhost:5010/api';
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private menuController: MenuController,
    private http: HttpClient,
    private challengeService: ChallengeService,
    private ecoCalendarService: EcoCalendarService 
  ) {
    
    const savedNotificationPref = localStorage.getItem('notificationsEnabled');
    this.updateUpcomingEventsCount();
    this.notificationsEnabled = savedNotificationPref === 'true';
    if (this.notificationsEnabled) {
      this.initializeNotifications();
    }
    addIcons({arrowBackOutline,notifications,calendarOutline,moon,chatbox,
      keyOutline,informationCircle,logOut,language,settings});
    }
  
  async closeMenu() {
    await this.menuController.close();
  }
  private updateUpcomingEventsCount() {
    const today = new Date();
    const events = this.ecoCalendarService.getAllEvents();
    this.upcomingEventsCount = events.filter(event => event.date >= today).length;
    this.hasUpcomingEvents = this.upcomingEventsCount > 0;
  }
  async provideFeedback() {
    const alert = await this.alertController.create({
      header: 'Provide Feedback',
      cssClass:'light-alert',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Share your thoughts with us...'
        },
        {
          name: 'rating',
          type: 'number',
          placeholder: 'Rating (1-5)',
          min: 1,
          max: 5
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Submit',
          handler: async (data) => {
            if (!data.feedback?.trim()) {
              this.showError('Please enter your feedback');
              return false;
            }
  
            const rating = parseInt(data.rating);
            if (isNaN(rating) || rating < 1 || rating > 5) {
              this.showError('Please enter a valid rating between 1 and 5');
              return false;
            }
  
            try {
              const user = await this.authService.getCurrentUser();
              if (!user) {
                this.showError('Please log in to submit feedback');
                return false;
              }
  
              await this.http.post(`${this.apiUrl}/feedback`, {
                uid: user.uid,
                message: data.feedback.trim(),
                rating: rating
              }).toPromise();
  
              this.showSuccess('Thank you for your feedback!');
              await this.menuController.close();
              return true;
            } catch (error) {
              console.error('Feedback submission error:', error);
              this.showError('Failed to submit feedback');
              return false;
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  async aboutEFA() {
    await this.menuController.close();
    this.router.navigate(['/about-efa']);
  }
  async ecoCalendar(){
    await this.menuController.close();
    this.router.navigate(['/eco-calendar']);
  }
  async toggleNotifications() {
    try {
      if (this.notificationsEnabled) {
        // Request permission when enabling
        const permResult = await LocalNotifications.requestPermissions();
        if (permResult.display !== 'granted') {
          this.showError('Notification permission is required');
          this.notificationsEnabled = false;
          return;
        }
      }

      // Save preference
      localStorage.setItem('notificationsEnabled', this.notificationsEnabled.toString());

      if (this.notificationsEnabled) {
        await this.initializeNotifications();
        this.showSuccess('Notifications enabled');
      } else {
        await this.cancelNotifications();
        this.showSuccess('Notifications disabled');
      }
    } catch (error) {
      console.error('Notification toggle error:', error);
      this.showError('Failed to update notification settings');
    }
  }

  private async initializeNotifications() {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) return;

      // Get active challenges
      this.challengeService.getUserChallenges(user.uid).subscribe({
        next: async (challenges) => {
          const activeChallenges = challenges.filter(c => c.completion_status === 'in_progress');
          
          if (activeChallenges.length > 0) {
            // Schedule daily notification
            await LocalNotifications.schedule({
              notifications: [{
                id: 1,
                title: 'Daily Challenge Check-in',
                body: 'Remember to check in for your active eco challenges!',
                schedule: {
                  at: new Date(new Date().setHours(9, 0, 0, 0)), // Set for 9 AM
                  every: 'day'  // Daily repeat
                }
              }]
            });
          }
        },
        error: (error) => {
          console.error('Error fetching challenges for notifications:', error);
        }
      });
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
}

private async cancelNotifications() {
    try {
      // Use cancel instead of cancelAll
      await LocalNotifications.cancel({
        notifications: [{
          id: 1
        }]
      });
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
}
private applyTheme(isDark: boolean) {
  document.body.classList.toggle('ion-palette-dark', isDark);
  document.body.style.setProperty('color-scheme', isDark ? 'dark' : 'light');
  
  // Store theme preference
  localStorage.setItem('darkMode', isDark.toString());
}

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Change Password',
      cssClass:'light-alert',
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
      cssClass:'light-alert',
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async showSuccess(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      cssClass:'light-alert',
      buttons: ['OK'],
    });
    await alert.present();
  }
  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      cssClass:'light-alert',
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