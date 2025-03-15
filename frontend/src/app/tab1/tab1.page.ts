import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopoverController } from '@ionic/angular/standalone';
import { DailyTipComponent } from '../components/daily-tip/daily-tip.component';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButtons,
    IonMenuButton,
    DailyTipComponent
  ],
})
export class Tab1Page implements OnInit {
  constructor(private router: Router,
    private popoverController: PopoverController
  ) {}
  async ngOnInit() {
    // ...existing code...
    await this.presentDailyTip();
  }

  async presentDailyTip() {
    const popover = await this.popoverController.create({
      component: DailyTipComponent,
      cssClass: 'daily-tip-popover',
      dismissOnSelect: false,
      showBackdrop: true,
      alignment: 'center'
    });

    await popover.present();

    // Auto dismiss after 10 seconds
    setTimeout(() => {
      popover.dismiss();
    }, 10000);
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
