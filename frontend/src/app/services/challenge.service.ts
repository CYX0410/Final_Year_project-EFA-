import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = 'http://54.179.34.214:5010/api';
  private checkedInToday = new Set<string>();

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
  getAvailableChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${this.apiUrl}/challenges`);
  }

  getUserChallenges(uid: string): Observable<ChallengeProgress[]> {
    return this.http.get<ChallengeProgress[]>(`${this.apiUrl}/challenges/progress/${uid}`);
  }

  startChallenge(uid: string, challengeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/challenges/start`, { uid, challengeId });
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
      return new Observable(observer => {
        observer.error({ error: { message: 'Already checked in today' } });
      });
    }

    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/challenges/checkin`, { progressId }).subscribe({
        next: (response) => {
          this.checkedInToday.add(progressId);
          this.saveCheckedInChallenges();
          observer.next(response);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}