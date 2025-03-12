// Add to both files
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ecotips', // or 'app-eco-challenges' for the other file
  templateUrl: './ecotips.page.html', // or './eco-challenges.page.html'
  styleUrls: ['./ecotips.page.scss'], // or './eco-challenges.page.scss'
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon
  ]
})
export class EcotipsPage implements OnInit { // or EcoChallengesPage
  constructor(private router: Router) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/tabs/home']);
  }
}