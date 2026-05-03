/* src/app/features/coordinatrice/taches/coord-taches.component.ts */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TacheService, ComiteService, UtilisateurService } from '../../../core/services/api.services';
import { Tache, Comite, User } from '../../../core/models';

@Component({
  selector: 'app-coord-taches',
  templateUrl: './coord-taches.component.html',
  styleUrls: ['./coord-taches.component.scss'],
})
export class CoordTachesComponent implements OnInit {
  taches: Tache[] = [];
  comites: Comite[] = [];
  membres: User[] = [];
  loading = false;
  filterStatut = 'TOUS';
  filterComite = 'TOUS';
  showModal = false;
  editMode = false;
  editId: number | null = null;
  form: FormGroup;

  statuts = ['TOUS', 'A_FAIRE', 'EN_COURS', 'TERMINEE', 'EN_RETARD'];

  mockTaches: Tache[] = [
    { id:1, titre:'Contacter sponsors principaux', description:'Prendre contact avec les 10 sponsors cibles', dateDebut:'2025-02-01', dateFin:'2025-02-28', priorite:'URGENTE', statut:'EN_RETARD', comiteId:1, comiteNom:'Sponsoring', membreNom:'Ahmed Ben Ali' },
    { id:2, titre:'Créer charte graphique 2025',   description:'Logo, couleurs, typographie',                 dateDebut:'2025-02-01', dateFin:'2025-03-10', priorite:'URGENTE', statut:'TERMINEE',  comiteId:2, comiteNom:'Design',     membreNom:'Rawen Zgarni'  },
    { id:3, titre:'Réserver la salle principale',  description:'Confirmation du lieu avec la direction',      dateDebut:'2025-02-15', dateFin:'2025-03-01', priorite:'URGENTE', statut:'TERMINEE',  comiteId:3, comiteNom:'Logistique', membreNom:'Sara Trabelsi' },
    { id:4, titre:'Programme des conférences',     description:'Finaliser le planning des sessions',           dateDebut:'2025-03-01', dateFin:'2025-04-01', priorite:'NORMALE', statut:'EN_COURS',  comiteId:4, comiteNom:'Programme',  membreNom:'Youssef Hamdi' },
    { id:5, titre:'Couverture réseaux sociaux',    description:'Stratégie LinkedIn, Instagram, Facebook',     dateDebut:'2025-03-15', dateFin:'2025-04-10', priorite:'NORMALE', statut:'EN_COURS',  comiteId:5, comiteNom:'Média',      membreNom:'Lina Mrad'     },
    { id:6, titre:'Badges et matériel',            description:'Commander les badges et kits accueil',        dateDebut:'2025-03-20', dateFin:'2025-04-15', priorite:'NORMALE', statut:'A_FAIRE',   comiteId:3, comiteNom:'Logistique', membreNom:'Sara Trabelsi' },
    { id:7, titre:'Newsletter entreprises',        description:'Envoyer newsletter aux 200 entreprises',      dateDebut:'2025-03-10', dateFin:'2025-03-31', priorite:'URGENTE', statut:'EN_RETARD', comiteId:1, comiteNom:'Sponsoring', membreNom:'Ahmed Ben Ali' },
  ];

  constructor(
    private tacheService: TacheService,
    private comiteService: ComiteService,
    private userService: UtilisateurService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      titre:       ['', Validators.required],
      description: [''],
      dateDebut:   ['', Validators.required],
      dateFin:     ['', Validators.required],
      priorite:    ['NORMALE', Validators.required],
      statut:      ['A_FAIRE', Validators.required],
      comiteId:    [null, Validators.required],
      membreId:    [null],
    });
  }

  ngOnInit(): void { this.load(); this.loadComites(); }

  load(): void {
    this.loading = true;
    this.tacheService.getAll().subscribe({
      next: t => { this.taches = t; this.loading = false; },
      error: () => { this.taches = this.mockTaches; this.loading = false; },
    });
  }

  loadComites(): void {
    this.comiteService.getAll().subscribe({ next: c => this.comites = c, error: () => {} });
  }

  get filtered(): Tache[] {
    return this.taches.filter(t =>
      (this.filterStatut === 'TOUS' || t.statut === this.filterStatut) &&
      (this.filterComite === 'TOUS' || t.comiteNom === this.filterComite)
    );
  }

  get uniqueComites(): string[] {
    return [...new Set(this.taches.map(t => t.comiteNom || ''))].filter(Boolean);
  }

  openCreate(): void {
    this.editMode = false; this.editId = null;
    this.form.reset({ priorite: 'NORMALE', statut: 'A_FAIRE' });
    this.showModal = true;
  }

  openEdit(t: Tache): void {
    this.editMode = true; this.editId = t.id;
    this.form.patchValue(t);
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const obs = this.editMode && this.editId
      ? this.tacheService.update(this.editId, this.form.value)
      : this.tacheService.create(this.form.value);
    obs.subscribe({ next: () => { this.showModal = false; this.load(); }, error: () => this.load() });
  }

  changerStatut(t: Tache, statut: string): void {
    this.tacheService.changerStatut(t.id, statut).subscribe({
      next: () => t.statut = statut as any,
      error: () => t.statut = statut as any,
    });
  }

  countByStatut(s: string): number {
    return s === 'TOUS' ? this.taches.length : this.taches.filter(t => t.statut === s).length;
  }

  get f() { return this.form.controls; }
}
