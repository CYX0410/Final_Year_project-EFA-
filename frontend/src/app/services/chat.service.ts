import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl;
  private timeoutDuration = 30000; // 30 seconds timeout

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat`, { message })
      .pipe(
        timeout(this.timeoutDuration),
        catchError(error => {
          console.error('Chat error:', error);
          return throwError(() => new Error(error.error?.error || 'Failed to get response'));
        })
      );
  }
}