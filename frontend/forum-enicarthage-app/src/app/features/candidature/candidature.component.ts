// src/app/features/candidature/candidature.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type Step = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-candidature',
  templateUrl: './candidature.component.html',
  styleUrls: ['./candidature.component.scss'],
})
export class CandidatureComponent implements OnInit {
  step: Step = 1;
  form: FormGroup;
  loading = false;
  success = false;
  error = '';
  selectedFile: File | null = null;
  fileError = '';
  dragOver = false;

  get stepTitle(): string {
    switch(this.step) {
      case 1: return 'Informations Personnelles';
      case 2: return 'Poste Visé';
      case 3: return 'Motivations';
      case 4: return 'Téléversement du CV';
      default: return '';
    }
  }

  postes = [
    {
      value: 'COORDINATRICE',
      label: 'Coordinatrice Générale',
      desc: 'Supervision de tous les comités du Forum',
      icon: '🎯',
    },
    {
      value: 'CHEF_COMITE',
      label: 'Chef de Comité',
      desc: 'Gérer un comité et ses membres',
      icon: '👑',
    },
    {
      value: 'MEMBRE',
      label: 'Membre de Comité',
      desc: 'Participer activement aux activités',
      icon: '👤',
    },
  ];

  comites = [
    { value: 'SPONSORING', label: 'Sponsoring', icon: '🤝' },
    { value: 'DESIGN', label: 'Design', icon: '🎨' },
    { value: 'LOGISTIQUE', label: 'Logistique', icon: '🏗' },
    { value: 'PROJET', label: 'Projet', icon: '⚙' },
    { value: 'PROGRAMME', label: 'Programme', icon: '📅' },
    { value: 'MEDIA', label: 'Média', icon: '📸' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      // Étape 1 — Informations personnelles
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9+\s\-]{8,15}$/)]],
      linkedinUrl: [''],

      // Étape 2 — Poste et comité
      posteVise: ['', Validators.required],
      comiteVise: [''],

      // Étape 3 — Motivation
      motivation: ['', [Validators.required, Validators.minLength(100)]],
    });
  }

  ngOnInit(): void {
    // Rendre comiteVise obligatoire si poste != COORDINATRICE
    this.form.get('posteVise')!.valueChanges.subscribe(poste => {
      const comiteControl = this.form.get('comiteVise')!;
      if (poste === 'COORDINATRICE') {
        comiteControl.clearValidators();
        comiteControl.setValue('');
      } else {
        comiteControl.setValidators(Validators.required);
      }
      comiteControl.updateValueAndValidity();
    });
  }

  // ─── NAVIGATION ÉTAPES ─────────────────────────────────────────────────────

  nextStep(): void {
    const stepFields: Record<number, string[]> = {
      1: ['nom', 'email', 'telephone'],
      2: ['posteVise', 'comiteVise'],
      3: ['motivation'],
    };

    const fields = stepFields[this.step];
    fields.forEach(f => this.form.get(f)?.markAsTouched());

    const valid = fields.every(f => this.form.get(f)?.valid);
    if (!valid) return;

    // Étape 3 → 4 : vérifier le CV
    if (this.step === 3) {
      if (!this.selectedFile) {
        this.fileError = 'Le CV (PDF) est obligatoire.';
        return;
      }
    }

    this.step = (this.step + 1) as Step;
    window.scrollTo(0, 0);
  }

  prevStep(): void {
    if (this.step > 1) this.step = (this.step - 1) as Step;
  }

  // ─── UPLOAD CV ─────────────────────────────────────────────────────────────

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(): void {
    this.dragOver = false;
  }

  private handleFile(file: File): void {
    this.fileError = '';
    if (file.type !== 'application/pdf') {
      this.fileError = 'Seuls les fichiers PDF sont acceptés.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.fileError = 'Le fichier ne doit pas dépasser 5 MB.';
      return;
    }
    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileError = '';
  }

  // ─── SOUMISSION ────────────────────────────────────────────────────────────

  submit(): void {
    if (this.form.invalid || !this.selectedFile) return;
    this.loading = true;
    this.error = '';

    const formData = new FormData();
    const v = this.form.value;

    formData.append('nom', v.nom);
    formData.append('email', v.email);
    formData.append('telephone', v.telephone);
    if (v.linkedinUrl) formData.append('linkedinUrl', v.linkedinUrl);
    formData.append('posteVise', v.posteVise);
    if (v.comiteVise) formData.append('comiteVise', v.comiteVise);
    formData.append('motivation', v.motivation);
    formData.append('fichierCV', this.selectedFile);

    this.http.post(`${environment.apiUrl}/candidatures/soumettre`, formData).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.loading = false;
      },
    });
  }

  // ─── HELPERS ───────────────────────────────────────────────────────────────

  get needsComite(): boolean {
    const p = this.form.get('posteVise')?.value;
    return p === 'CHEF_COMITE' || p === 'MEMBRE';
  }

  get motivationLength(): number {
    return this.form.get('motivation')?.value?.length || 0;
  }

  get f() { return this.form.controls; }

  get fileSizeLabel(): string {
    if (!this.selectedFile) return '';
    const kb = this.selectedFile.size / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  }
}