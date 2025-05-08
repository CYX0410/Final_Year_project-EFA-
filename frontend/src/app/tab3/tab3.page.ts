import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonProgressBar,
  IonList,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonProgressBar,
    IonSpinner
  ]
})
export class Tab3Page implements OnInit {
  completedChallenges: ChallengeProgress[] = [];
  activeChallenges: ChallengeProgress[] = [];
  totalPoints: number = 0;
  loading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();
  private _cachedCompletedChallenges: ChallengeProgress[] | null = null;
  constructor(
    private challengeService: ChallengeService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ trophy, ribbonOutline, timeOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.loadChallenges();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  clearCache() {
    this._cachedCompletedChallenges = null;
    this.calculateTotalPoints(); // Recalculate after clearing cache
}
  async loadChallenges() {
    try {
      this.loading = true;
      const user = await this.authService.getCurrentUser();
      
      if (user) {
        this.challengeService.getUserChallenges(user.uid).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (progress) => {
                requestAnimationFrame(() => {
                    this.activeChallenges = progress.filter(p => p.completion_status === 'in_progress');
                    this.completedChallenges = progress.filter(p => p.completion_status === 'completed');
                    this._cachedCompletedChallenges = null; // Clear cache when new data arrives
                    this.calculateTotalPoints(); // Calculate points after data is loaded
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (error) => {
                console.error('Error loading challenges:', error);
                this.errorMessage = 'Failed to load challenges';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
} catch (error) {
    console.error('Error:', error);
    this.errorMessage = 'Failed to load tracking data';
    this.loading = false;
    this.cdr.detectChanges();
}
}

private calculateTotalPoints() {
  if (this.completedChallenges.length === 0) {
      this.totalPoints = 0;
      return;
  }

  requestAnimationFrame(() => {
      // Use unique challenges to avoid counting duplicates
      const uniqueChallenges = this.getUniqueCompletedChallenges();
      this.totalPoints = uniqueChallenges.reduce((sum, challenge) => {
          return sum + (Number(challenge.total_points_earned) || 0);
      }, 0);
      
      this.cdr.detectChanges();
  });
}

  getProgressPercentage(challenge: ChallengeProgress): number {
    return (challenge.current_streak / challenge.duration_days) * 100;
  }

  getUniqueCompletedChallenges(): ChallengeProgress[] {
    if (!this._cachedCompletedChallenges) {
        const challengeMap = new Map<string, ChallengeProgress>();
        
        this.completedChallenges.forEach(challenge => {
            const existingChallenge = challengeMap.get(challenge.challenge_id);
            if (!existingChallenge) {
                challengeMap.set(challenge.challenge_id, {
                    ...challenge,
                    // Ensure numeric values
                    total_points_earned: Number(challenge.total_points_earned) || 0,
                    completion_count: Number(challenge.completion_count) || 0
                });
            } else if (new Date(challenge.last_check_in) > new Date(existingChallenge.last_check_in)) {
                challengeMap.set(challenge.challenge_id, {
                    ...challenge,
                    // Ensure numeric values
                    total_points_earned: Number(challenge.total_points_earned) || 0,
                    completion_count: Number(challenge.completion_count) || 0
                });
            }
        });
        
        this._cachedCompletedChallenges = Array.from(challengeMap.values());
    }
    return this._cachedCompletedChallenges;
}
}