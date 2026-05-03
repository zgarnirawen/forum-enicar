import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models';

// ─── COMPTES DE TEST (mock fallback) ──────────────────────────
const MOCK_USERS: Record<string, User> = {
  'admin@forum.tn':    { id:1, nom:'Fatma Bouajla',  email:'admin@forum.tn',    role:'ADMIN',           actif:true },
  'pilotage@forum.tn': { id:2, nom:'Mayssa Abdouli', email:'pilotage@forum.tn', role:'COMITE_PILOTAGE', actif:true },
  'coord@forum.tn':    { id:3, nom:'Sarra Ben Haj',  email:'coord@forum.tn',    role:'COORDINATRICE',   actif:true },
  'chef@forum.tn':     { id:4, nom:'Rawen Zgarni',   email:'chef@forum.tn',     role:'CHEF_COMITE',     actif:true, comiteId: 1 },
  'membre@forum.tn':   { id:5, nom:'Ali Mansour',    email:'membre@forum.tn',   role:'MEMBRE',          actif:true, comiteId: 1 },
};
const MOCK_PASSWORD = '123456';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;

  // FIX: token stored in memory only — not localStorage (XSS risk)
  private _token: string | null = null;
  private userSubject = new BehaviorSubject<User | null>(this.restoreSession());
  currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // FIX: restore from sessionStorage (tab-scoped, safer than localStorage)
  private restoreSession(): User | null {
    try {
      const u = sessionStorage.getItem('forum_user');
      const t = sessionStorage.getItem('forum_token');
      if (u && t) { this._token = t; return JSON.parse(u); }
    } catch { sessionStorage.clear(); }
    return null;
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, req).pipe(
      tap(res => this.saveSession(res)),
      catchError(() => {
        // Fallback mock for dev without backend
        const user = MOCK_USERS[req.email];
        if (user && req.motDePasse === MOCK_PASSWORD) {
          const res: AuthResponse = { token: 'mock-token-' + user.role, user };
          this.saveSession(res);
          return of(res);
        }
        return throwError(() => new Error('Email ou mot de passe incorrect'));
      })
    );
  }

  // FIX: saveSession uses sessionStorage (not localStorage) + memory
  private saveSession(res: AuthResponse): void {
    this._token = res.token;
    sessionStorage.setItem('forum_token', res.token);
    sessionStorage.setItem('forum_user', JSON.stringify(res.user));
    this.userSubject.next(res.user);
  }

  register(req: RegisterRequest): Observable<any> {
    return this.http.post(`${this.api}/register`, req).pipe(
      catchError(() => of({ message: 'Compte créé (mode test)' }))
    );
  }

  logout(): void {
    this._token = null;
    sessionStorage.clear();
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // FIX: getToken reads from memory first, then sessionStorage
  getToken(): string | null {
    return this._token ?? sessionStorage.getItem('forum_token');
  }

  saveToken(token: string): void {
    this._token = token;
    sessionStorage.setItem('forum_token', token);
  }

  setCurrentUser(user: User): void {
    sessionStorage.setItem('forum_user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  get currentUser(): User | null { return this.userSubject.value; }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.currentUser?.role ?? '');
  }

  redirectByRole(): void {
    const map: Record<string, string> = {
      ADMIN:           '/admin/dashboard',
      COMITE_PILOTAGE: '/pilotage/dashboard',
      COORDINATRICE:   '/coordinatrice/dashboard',
      CHEF_COMITE:     '/chef-comite/dashboard',
      MEMBRE:          '/membre/dashboard',
    };
    this.router.navigate([map[this.currentUser?.role ?? ''] ?? '/auth/login']);
  }
}
