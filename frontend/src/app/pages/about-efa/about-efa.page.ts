import { Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  home, 
  leaf, 
  bulb, 
  trophy, 
  analytics, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-about-efa',
  templateUrl: './about-efa.page.html',
  styleUrls: ['./about-efa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class AboutEfaPage {
   @ViewChild(IonContent) content!: IonContent;
  constructor(private router: Router) {
    addIcons({arrowBackOutline,home,leaf,bulb,trophy,analytics,calendarOutline});
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }
    async ionViewDidEnter() {
    // Handle keyboard
    Keyboard.addListener('keyboardWillShow', () => {
      // Scroll to focused input
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        this.content.scrollToPoint(0, activeElement.offsetTop - 20, 500);
      }
    });
  }

  ionViewWillLeave() {
    // Remove keyboard listener
    Keyboard.removeAllListeners();
  }
}