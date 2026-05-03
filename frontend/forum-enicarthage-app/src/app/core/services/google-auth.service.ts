import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models';

declare var google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private googleClientId = 'YOUR_GOOGLE_CLIENT_ID'; // Will be set after initialization
  private googleAvailable$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    this.initGoogle();
  }

  private initGoogle(): void {
    // Load Google Client ID from environment
    this.googleClientId = environment.googleClientId || '';
    
    if (typeof google !== 'undefined' && this.googleClientId) {
      this.googleAvailable$.next(true);
    }
  }

  /**
   * Login with Google ID Token
   */
  loginWithGoogle(idToken: string, accessToken: string): Observable<AuthResponse> {
    const request = {
      idToken: idToken,
      accessToken: accessToken
    };
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/google/login`, request);
  }

  /**
   * Initialize Google Sign-In button
   */
  initGoogleSignInButton(elementId: string, onSuccess: (response: any) => void, onError?: () => void): void {
    if (typeof google === 'undefined' || !this.googleClientId) {
      console.error('Google SDK not loaded or Client ID not configured');
      return;
    }

    this.ngZone.run(() => {
      try {
        google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: (response: any) => this.handleGoogleSignIn(response, onSuccess, onError)
        });

        google.accounts.id.renderButton(
          document.getElementById(elementId),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            locale: 'fr'
          }
        );
      } catch (error) {
        console.error('Error initializing Google Sign-In button:', error);
      }
    });
  }

  /**
   * Handle Google Sign-In response
   */
  private handleGoogleSignIn(response: any, onSuccess: (response: any) => void, onError?: () => void): void {
    if (response.credential) {
      this.ngZone.run(() => {
        onSuccess(response);
      });
    } else {
      onError?.();
    }
  }

  /**
   * Check if Google is available
   */
  isGoogleAvailable(): Observable<boolean> {
    return this.googleAvailable$;
  }
}
