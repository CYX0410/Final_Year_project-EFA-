import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
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
    title: '🌱 Plant-Based Power!',
    content: 'Try "Meatless Monday" today! Swapping one meat meal for a veggie option saves water equivalent to 3 weeks of showers. Small changes, big impact! 🥗'
  },
  {
    title: '💧 Water Warrior Challenge',
    content: 'Be a water hero! Collect rainwater for your plants or time your showers. Every drop saved is a high-five to Mother Earth! 🌍'
  },
  {
    title: '⚡ Energy Ninja Mode',
    content: 'Channel your inner energy ninja! Unplug devices when not in use - they secretly drain power even when off. Sneaky energy vampires, begone! 🥷'
  },
  {
    title: '♻️ Recycling Rockstar',
    content: 'Transform into a recycling superhero! Give your waste a second chance at life. Remember: Today\'s trash could be tomorrow\'s treasure! ⭐'
  },
  {
    title: '🚲 Green Transportation Goals',
    content: 'Be a climate champion! Walk, bike, or take public transport. Every car-free trip is like giving Earth a big, warm hug! 🌿'
  },
  {
    title: '🛍️ Zero-Waste Warrior',
    content: 'Join the zero-waste revolution! Bring reusable bags, say no to straws, and choose package-free options. Small acts of eco-kindness add up! 💚'
  },
  {
    title: '🌿 Garden Guardian',
    content: 'Start a mini garden adventure! Even a small pot of herbs on your windowsill helps save bees and makes your meals extra special! 🐝'
  },
  {
    title: '💡 Light Knight',
    content: 'Be a guardian of light! Switch to LED bulbs - they\'re like tiny eco-warriors fighting energy waste while lighting up your world! ✨'
  },
  {
    title: '🧊 Cool Climate Keeper',
    content: 'Be cool & eco-smart! Set your AC just 2°C higher - you\'ll barely notice, but Earth will thank you with a fresher, cleaner future! ❄️'
  },
  {
    title: '📱 Digital Earth Defender',
    content: 'Go digital hero mode! Choose e-bills, read e-books, and reduce paper use. Every tree saved is a victory for our planet! 🌳'
  },
  {
    title: '🧴 DIY Eco Wizard',
    content: 'Create your own cleaning magic! Mix vinegar & water for an eco-friendly cleaner. Safe for your home, kind to our oceans! 🌊'
  },
  {
    title: '🥤 Plastic-Free Pioneer',
    content: 'Join the plastic-free movement! Carry your reusable water bottle like a badge of honor. You\'re not just staying hydrated - you\'re saving oceans! 🌊'
  }
];

@Component({
  selector: 'app-daily-tip',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-subtitle>
          <ion-icon name="leaf-outline" color="success"></ion-icon>
          Today's Eco Adventure
        </ion-card-subtitle>
        <ion-card-title>{{ dailyTip.title }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p class="tip-content">{{ dailyTip.content }}</p>
        <ion-button fill="clear" (click)="learnMore()" class="learn-more-btn">
          Discover More Tips
          <ion-icon name="arrow-forward" slot="end"></ion-icon>
        </ion-button>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    ion-card {
      margin: 0;
      border-radius: 16px;
      background: linear-gradient(145deg, #E8F5E9, #C8E6C9);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    ion-card-subtitle {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #2E7D32;
      font-weight: 600;
      font-size: 1.1em;
    }
    ion-card-title {
      font-size: 1.4em;
      color: #1B5E20;
      margin-top: 8px;
    }
    .tip-content {
      font-size: 1.1em;
      line-height: 1.6;
      color: #33691E;
      margin: 16px 0;
    }
    .learn-more-btn {
      --color: #2E7D32;
      font-weight: 600;
      margin-top: 16px;
      
      &:hover {
        --color: #1B5E20;
      }
    }
    ion-icon {
      font-size: 20px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon
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