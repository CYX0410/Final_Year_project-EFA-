import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { PopoverController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { DailyTipComponent } from '../components/daily-tip/daily-tip.component';
import { MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline, bagHandle, leaf, trophy, ribbon } from 'ionicons/icons';
import { ChallengeService, ChallengeProgress } from '../services/challenge.service';
import { 
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton, 
    IonIcon, 
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle
  ],
})
export class Tab1Page implements OnInit {
  username: string = '';
  activeChallenges: ChallengeProgress[] = [];
  completedChallenges: ChallengeProgress[] = []; // Add this property
  totalPoints: number = 0;

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private authService: AuthService,
    private menuController: MenuController,
    private challengeService: ChallengeService 
  ) {
    addIcons({ 
      settingsOutline, 
      bagHandle, 
      leaf, 
      trophy, 
      ribbon 
    });
  }

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.authService.getUserProfile(user.uid).subscribe({
        next: (profile) => {
          this.username = profile?.username || user.displayName || 'User';
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.username = 'User';
        }
      });
       // Load challenges and points
       this.challengeService.getUserChallenges(user.uid).subscribe({
        next: (progress) => {
          this.activeChallenges = progress.filter(p => p.completion_status === 'in_progress');
          this.completedChallenges = progress.filter(p => p.completion_status === 'completed');
          this.calculateTotalPoints(progress);
        },
        error: (error) => {
          console.error('Error loading challenges:', error);
        }
      });
    }
    await this.presentDailyTip();
  }
  private calculateTotalPoints(challenges: ChallengeProgress[]) {
    this.totalPoints = challenges
        .filter(c => c.completion_status === 'completed')
        .reduce((sum, challenge) => {
            // Use total_points_earned instead of just points
            const earnedPoints = challenge.total_points_earned || 
                               (challenge.points * (challenge.completion_count || 1));
            return sum + earnedPoints;
        }, 0);
}
  async openSettings() {
    await this.menuController.open();
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

  getEcoScore(): number {
    let score = 0;
    const maxScore = 100;
    
    const challengeWeight = 0.4;
    const pointsWeight = 0.4;
    const actionsWeight = 0.2;

    // Use completed challenges count instead of active challenges
    const challengeScore = (this.completedChallenges?.length || 0) * 10;
    const pointsScore = this.totalPoints / 100;
    const actionsScore = 80;

    score = (challengeScore * challengeWeight) + 
            (pointsScore * pointsWeight) + 
            (actionsScore * actionsWeight);

    return Math.min(Math.round(score), maxScore);
}

  getCompletedChallengesCount(): number {
    return this.completedChallenges?.length || 0;
  }

  getTotalPoints(): number {
    return this.totalPoints || 0;
  }
}