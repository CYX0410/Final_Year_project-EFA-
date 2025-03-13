import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonIcon, IonCard,
  IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonBadge, IonList, IonItem,
  IonLabel, IonProgressBar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trophy, checkmark, time } from 'ionicons/icons';
import { ChallengeService, Challenge, ChallengeProgress } from '../../services/challenge.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-eco-challenges',
  templateUrl: './eco-challenges.page.html',
  styleUrls: ['./eco-challenges.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonBadge, IonList, IonItem,
    IonLabel, IonProgressBar
  ]
})
export class EcoChallengesPage implements OnInit {
  availableChallenges: Challenge[] = [];
  activeChallenges: ChallengeProgress[] = [];
  completedChallenges: ChallengeProgress[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private challengeService: ChallengeService,
    private authService: AuthService
  ) {
    addIcons({ arrowBackOutline, trophy, checkmark, time });
  }

  async ngOnInit() {
    await this.loadChallenges();
  }

  async loadChallenges() {
    try {
      this.loading = true;
      const user = await this.authService.getCurrentUser();
      
      if (user) {
        // Load available challenges
        this.challengeService.getAvailableChallenges().subscribe(
          challenges => this.availableChallenges = challenges
        );

        // Load user's challenges
        this.challengeService.getUserChallenges(user.uid).subscribe(
          progress => {
            this.activeChallenges = progress.filter(p => p.completion_status === 'in_progress');
            this.completedChallenges = progress.filter(p => p.completion_status === 'completed');
          }
        );
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      this.errorMessage = 'Failed to load challenges';
    } finally {
      this.loading = false;
    }
  }

  async startChallenge(challengeId: string) {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        await this.challengeService.startChallenge(user.uid, challengeId).toPromise();
        await this.loadChallenges();
      }
    } catch (error) {
      console.error('Error starting challenge:', error);
      this.errorMessage = 'Failed to start challenge';
    }
  }

  async checkIn(progressId: string) {
    try {
      await this.challengeService.checkIn(progressId).toPromise();
      await this.loadChallenges();
    } catch (error) {
      console.error('Error checking in:', error);
      this.errorMessage = 'Failed to check in';
    }
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }
}