import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';
import { Role } from '../../../core/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements AfterViewInit {
  form: FormGroup;
  step = 1;
  loading = false;
  error = '';
  success = false;

  roles: { value: Role; label: string; desc: string; icon: string }[] = [
    { value: 'CHEF_COMITE',    label: 'Chef de comité',    desc: 'Gérer un comité et ses membres', icon: '👑' },
    { value: 'MEMBRE',         label: 'Membre',            desc: 'Participer aux activités du forum', icon: '👤' },
    { value: 'COORDINATRICE',  label: 'Coordinatrice',     desc: 'Superviser tous les comités', icon: '🎯' },
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private googleAuth: GoogleAuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(8)]],
      role: ['MEMBRE', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    // Initialize Google Sign-In button
    this.googleAuth.initGoogleSignInButton(
      'googleSignInRegisterButton',
      (response: any) => this.handleGoogleSignUp(response)
    );
  }

  handleGoogleSignUp(response: any): void {
    const idToken = response.credential;
    if (!idToken) { this.error = 'Erreur Google Sign-In'; return; }
    
    this.loading = true;
    this.error = '';
    
    // For registration with Google, we use the same endpoint as login
    // Backend will create the user if it doesn't exist
    this.googleAuth.loginWithGoogle(idToken, '').subscribe({
      next: (authResponse) => {
        this.auth.saveToken(authResponse.token);
        this.auth.setCurrentUser(authResponse.user);
        this.success = true;
        setTimeout(() => this.auth.redirectByRole(), 2000);
      },
      error: (e) => {
        this.error = 'Erreur de connexion Google: ' + (e.error?.message || e.message);
        this.loading = false;
      }
    });
  }

  nextStep(): void {
    if (this.step === 1) {
      const controls = ['nom', 'email', 'motDePasse'];
      controls.forEach(c => this.form.get(c)?.markAsTouched());
      const valid = controls.every(c => this.form.get(c)?.valid);
      if (valid) this.step = 2;
    }
  }

  selectRole(role: Role): void { this.form.patchValue({ role }); }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: () => { this.success = true; setTimeout(() => this.router.navigate(['/auth/login']), 2000); },
      error: (e) => { this.error = e.message; this.loading = false; },
    });
  }

  get f() { return this.form.controls; }
  get pwStrength(): number {
    const pw = this.f['motDePasse'].value || '';
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }
}
