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
  selector: 'app-eco-challenges',
  templateUrl: './eco-challenges.page.html',
  styleUrls: ['./eco-challenges.page.scss'],
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
export class EcoChallengesPage implements OnInit {

  constructor(private router: Router) { 
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/tabs/home']);
  }
}
