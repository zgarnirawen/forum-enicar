import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-access-denied',
  template: `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;background:#f8fafc">
      <div style="text-align:center;padding:48px;background:white;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:420px">
        <div style="font-size:64px;margin-bottom:16px">🔒</div>
        <h1 style="font-size:24px;font-weight:600;color:#1e293b;margin:0 0 8px">Accès refusé</h1>
        <p style="color:#64748b;margin:0 0 32px">Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
        <button (click)="goBack()" style="background:#1e40af;color:white;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500">
          Retour au tableau de bord
        </button>
      </div>
    </div>
  `
})
export class AccessDeniedComponent {
  constructor(private auth: AuthService, private router: Router) {}
  goBack(): void { this.auth.redirectByRole(); }
}
