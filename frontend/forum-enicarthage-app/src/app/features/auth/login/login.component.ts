import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private googleAuth: GoogleAuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    });
    // Si déjà connecté
    if (this.auth.getToken()) this.auth.redirectByRole();
  }

  ngAfterViewInit(): void {
    // Initialize Google Sign-In button
    this.googleAuth.initGoogleSignInButton(
      'googleSignInButton',
      (response: any) => this.handleGoogleSignIn(response)
    );
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.login(this.form.value).subscribe({
      next: () => this.auth.redirectByRole(),
      error: (e) => { this.error = e.message; this.loading = false; },
    });
  }

  handleGoogleSignIn(response: any): void {
    const idToken = response.credential;
    if (!idToken) { this.error = 'Erreur Google Sign-In'; return; }
    
    this.loading = true;
    this.error = '';
    
    this.googleAuth.loginWithGoogle(idToken, '').subscribe({
      next: (authResponse) => {
        this.auth.saveToken(authResponse.token);
        this.auth.setCurrentUser(authResponse.user);
        this.auth.redirectByRole();
      },
      error: (e) => {
        this.error = 'Erreur de connexion Google: ' + (e.error?.message || e.message);
        this.loading = false;
      }
    });
  }

  get f() { return this.form.controls; }
}
