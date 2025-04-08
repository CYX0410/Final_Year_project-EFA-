import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  analytics
} from 'ionicons/icons';

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
  constructor(private router: Router) {
    addIcons({ 
      arrowBackOutline, 
      home, 
      leaf, 
      bulb, 
      trophy, 
      analytics
    });
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }
}