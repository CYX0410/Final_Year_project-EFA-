import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonProgressBar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonListHeader
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trophy, ribbonOutline, timeOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { ChallengeService, ChallengeProgress } from '../services/challenge.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonBadge,
    IonProgressBar,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonListHeader
  ]
})
export class Tab3Page implements OnInit {
  completedChallenges: ChallengeProgress[] = [];
  activeChallenges: ChallengeProgress[] = [];
  totalPoints: number = 0;
  loading = false;
  errorMessage = '';

  constructor(
    private challengeService: ChallengeService,
    private authService: AuthService
  ) {
    addIcons({ trophy, ribbonOutline, timeOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.loadChallenges();
  }

  async loadChallenges() {
    try {
      this.loading = true;
      const user = await this.authService.getCurrentUser();
      
      if (user) {
        this.challengeService.getUserChallenges(user.uid).subscribe(
          progress => {
            this.activeChallenges = progress.filter(p => p.completion_status === 'in_progress');
            this.completedChallenges = progress.filter(p => p.completion_status === 'completed');
            this.calculateTotalPoints();
          },
          error => {
            console.error('Error loading challenges:', error);
            this.errorMessage = 'Failed to load challenges';
          }
        );
      }
    } catch (error) {
      console.error('Error:', error);
      this.errorMessage = 'Failed to load tracking data';
    } finally {
      this.loading = false;
    }
  }

  private calculateTotalPoints() {
    this.totalPoints = this.completedChallenges.reduce((sum, challenge) => sum + challenge.points, 0);
  }

  getProgressPercentage(challenge: ChallengeProgress): number {
    return (challenge.current_streak / challenge.duration_days) * 100;
  }
}