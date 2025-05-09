import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Challenge {
  challenge_id: string;
  title: string;
  description: string;
  duration_days: number;
  points: number;
  created_at: string;
}

export interface ChallengeProgress {
  progress_id: string;
  uid: string;
  challenge_id: string;
  start_date: string;
  last_check_in: string;
  completion_status: 'in_progress' | 'completed' | 'failed';
  current_streak: number;
  title: string;
  description: string;
  duration_days: number;
  points: number;
  completion_count: number;
  total_points_earned: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = 'http://13.229.116.113:5010/api';
  private checkedInToday = new Set<string>();
  private challengeCache: BehaviorSubject<Challenge[]> = new BehaviorSubject<Challenge[]>([]);
  private userChallengesCache = new Map<string, BehaviorSubject<ChallengeProgress[]>>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {
    this.loadCheckedInChallenges();
  }
  private loadCheckedInChallenges() {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`checkedIn_${today}`);
    if (stored) {
      this.checkedInToday = new Set(JSON.parse(stored));
    } else {
      this.checkedInToday.clear();
    }
  }

  deleteChallenge(progressId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/challenges/progress/${progressId}`).pipe(
        tap(() => {
            this.clearAllCaches();
        }),
        catchError(error => {
            console.error('Error deleting challenge:', error);
            return throwError(() => new Error(error.error?.message || 'Failed to delete challenge'));
        })
    );
}

  getAvailableChallenges(): Observable<Challenge[]> {
    if (this.challengeCache.value.length === 0) {
      this.http.get<Challenge[]>(`${this.apiUrl}/challenges`).pipe(
        tap(challenges => {
          this.challengeCache.next(challenges);
          // Reset cache after timeout
          setTimeout(() => this.clearChallengeCache(), this.cacheTimeout);
        })
      ).subscribe();
    }
    return this.challengeCache.asObservable();
  }


  getUserChallenges(uid: string): Observable<ChallengeProgress[]> {
    if (!this.userChallengesCache.has(uid)) {
      this.userChallengesCache.set(uid, new BehaviorSubject<ChallengeProgress[]>([]));
      this.loadUserChallenges(uid);
    }
    return this.userChallengesCache.get(uid)!.asObservable();
  }

  private loadUserChallenges(uid: string) {
    this.http.get<ChallengeProgress[]>(`${this.apiUrl}/challenges/progress/${uid}`).pipe(
      tap(challenges => {
        this.userChallengesCache.get(uid)?.next(challenges);
        setTimeout(() => this.clearUserChallengesCache(uid), this.cacheTimeout);
      })
    ).subscribe();
  }

  startChallenge(uid: string, challengeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/challenges/start`, { uid, challengeId }).pipe(
      tap(() => this.clearAllCaches()) // Clear caches when starting new challenge
    );
  }

  private saveCheckedInChallenges() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`checkedIn_${today}`, JSON.stringify([...this.checkedInToday]));
  }

  isCheckedInToday(progressId: string): boolean {
    return this.checkedInToday.has(progressId);
  }

  checkIn(progressId: string): Observable<any> {
    if (this.isCheckedInToday(progressId)) {
      return throwError(() => new Error('Already checked in today'));
    }

    return this.http.post(`${this.apiUrl}/challenges/checkin`, { progressId }).pipe(
      tap(response => {
        this.checkedInToday.add(progressId);
        this.saveCheckedInChallenges();
        this.clearAllCaches(); // Clear caches on successful check-in
      })
    );
  }
    // Cache clearing methods
    private clearChallengeCache() {
      this.challengeCache.next([]);
    }
  
    private clearUserChallengesCache(uid: string) {
      this.userChallengesCache.delete(uid);
    }
  
    private clearAllCaches() {
      this.clearChallengeCache();
      [...this.userChallengesCache.keys()].forEach(uid => this.clearUserChallengesCache(uid));
    }
}