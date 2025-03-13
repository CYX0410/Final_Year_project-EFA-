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
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = 'http://localhost:5010/api';

  constructor(private http: HttpClient) {}

  getAvailableChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${this.apiUrl}/challenges`);
  }

  getUserChallenges(uid: string): Observable<ChallengeProgress[]> {
    return this.http.get<ChallengeProgress[]>(`${this.apiUrl}/challenges/progress/${uid}`);
  }

  startChallenge(uid: string, challengeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/challenges/start`, { uid, challengeId });
  }

  checkIn(progressId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/challenges/checkin`, { progressId });
  }
}