import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { leafOutline, arrowForward } from 'ionicons/icons';
const ECO_TIPS = [
    {
      title: 'Reduce Single-Use Plastics',
      content: 'Start your eco-journey by replacing disposable items with reusable alternatives. Use cloth bags, water bottles, and coffee cups.'
    },
    {
      title: 'Save Energy',
      content: 'Turn off lights when leaving a room and unplug electronics when not in use. Small actions add up to big energy savings!'
    },
    {
      title: 'Conserve Water',
      content: 'Fix leaky faucets and take shorter showers. Every drop counts in water conservation.'
    },
    {
      title: 'Recycle Right',
      content: 'Learn your local recycling guidelines and sort waste properly. Proper recycling makes a big difference!'
    },
    // Add more tips as needed
  ];
@Component({
  selector: 'app-daily-tip',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-subtitle>
          <ion-icon name="leaf-outline" color="success"></ion-icon>
          Daily Eco Tip
        </ion-card-subtitle>
        <ion-card-title>{{ dailyTip.title }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p>{{ dailyTip.content }}</p>
        <ion-button fill="clear" (click)="learnMore()">
          Learn More
          <ion-icon name="arrow-forward" slot="end"></ion-icon>
        </ion-button>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    ion-card {
      margin: 0;
      box-shadow: none;
    }
    ion-card-subtitle {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    ion-card-content {
      padding-top: 0;
    }
    ion-button {
      margin-top: 16px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle
  ]
})
export class DailyTipComponent {
    dailyTip = this.getRandomTip();
  

  constructor(private router: Router) {
    addIcons({ leafOutline, arrowForward });
  }
  private getRandomTip() {
    const today = new Date().getDate();
    return ECO_TIPS[today % ECO_TIPS.length];
  }
  learnMore() {
    this.router.navigate(['/ecotips']);
  }
}