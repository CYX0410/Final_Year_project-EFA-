import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonIcon, IonCard,
  IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonBadge, IonList, IonItem,
  IonLabel, IonProgressBar, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trophy, checkmark, time } from 'ionicons/icons';
import { ChallengeService, Challenge, ChallengeProgress } from '../../services/challenge.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-eco-challenges',
  templateUrl: './eco-challenges.page.html',
  styleUrls: ['./eco-challenges.page.scss'],
  animations: [
    trigger('tickAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonBadge, IonList, IonItem,
    IonLabel, IonProgressBar, IonSpinner
  ]
})
export class EcoChallengesPage implements OnInit {
  today: string = new Date().toISOString().split('T')[0];
  availableChallenges: Challenge[] = [];
  activeChallenges: ChallengeProgress[] = [];
  completedChallenges: ChallengeProgress[] = [];
  loading = false;
  errorMessage = '';
  checkedInChallenges: Set<string> = new Set(); // Add this to track checked-in challenges
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
        this.checkedInChallenges.clear();
        // Load available challenges
        this.challengeService.getAvailableChallenges().subscribe(
          challenges => {
            console.log('Available challenges:', challenges);
            this.availableChallenges = challenges;
          },
          error => {
            console.error('Error loading available challenges:', error);
            this.errorMessage = 'Failed to load available challenges';
          }
        );
  
        // Load user's challenges
        this.challengeService.getUserChallenges(user.uid).subscribe(
          progress => {
            this.activeChallenges = progress.filter(p => p.completion_status === 'in_progress');
            // Update checkedInChallenges set based on last_check_in dates
            this.activeChallenges.forEach(challenge => {
              if (challenge.last_check_in === this.today) {
                this.checkedInChallenges.add(challenge.progress_id);
              }
            });
            this.completedChallenges = progress.filter(p => p.completion_status === 'completed');
          },
          error => {
            console.error('Error loading user challenges:', error);
            this.errorMessage = 'Failed to load user challenges';
          }
        );
      }
    } catch (error) {
      console.error('Error in loadChallenges:', error);
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
  getTicks(totalDays: number): any[] {
    return Array(totalDays).fill(null);
  }
  
  async checkIn(progressId: string) {
    if (this.isCheckedIn(progressId)) {
      this.errorMessage = 'You have already checked in today for this challenge';
      return;
    }

    try {
      this.loading = true;
      await this.challengeService.checkIn(progressId).toPromise();
      await this.loadChallenges();
    } catch (error: any) {
      console.error('Error checking in:', error);
      this.errorMessage = error?.error?.message || 'Failed to check in';
    } finally {
      this.loading = false;
    }
  }

  isCheckedIn(progressId: string): boolean {
    return this.challengeService.isCheckedInToday(progressId);
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }
}