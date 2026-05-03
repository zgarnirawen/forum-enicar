import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TacheService, UtilisateurService } from '../../../core/services/api.services';
import { Tache, User } from '../../../core/models';

@Component({
  selector: 'app-chef-taches',
  templateUrl: './chef-taches.component.html',
  styleUrls: ['./chef-taches.component.scss'],
})
export class ChefTachesComponent implements OnInit {
  taches: Tache[] = [];
  membres: User[] = [];
  loading = false;
  filterStatut = 'TOUS';
  showModal = false;
  editMode = false;
  editId: number | null = null;
  confirmDelete = false;
  deleteId: number | null = null;
  form: FormGroup;
  statuts = ['TOUS','A_FAIRE','EN_COURS','TERMINEE','EN_RETARD'];

  mockTaches: Tache[] = [
    { id:1, titre:'Affiche principale Forum',  description:'Design A3 pour impression',  dateDebut:'2025-02-01', dateFin:'2025-03-10', priorite:'URGENTE', statut:'TERMINEE',  comiteId:2, comiteNom:'Design', membreNom:'Rawen Zgarni'  },
    { id:2, titre:'Bannières réseaux sociaux', description:'Formats LinkedIn, IG, FB',   dateDebut:'2025-02-15', dateFin:'2025-03-20', priorite:'NORMALE', statut:'EN_COURS',  comiteId:2, comiteNom:'Design', membreNom:'Ali Mansour'   },
    { id:3, titre:'Kit de bienvenue PDF',      description:'Brochure entreprises',       dateDebut:'2025-03-01', dateFin:'2025-04-01', priorite:'NORMALE', statut:'A_FAIRE',   comiteId:2, comiteNom:'Design', membreNom:'Sara Trabelsi' },
    { id:4, titre:'Vidéo teaser 60s',          description:'Motion design du Forum',     dateDebut:'2025-03-15', dateFin:'2025-04-10', priorite:'URGENTE', statut:'EN_RETARD', comiteId:2, comiteNom:'Design', membreNom:'Lina Mrad'     },
    { id:5, titre:'Templates email',           description:'Signature et newsletters',   dateDebut:'2025-03-20', dateFin:'2025-04-05', priorite:'NORMALE', statut:'A_FAIRE',   comiteId:2, comiteNom:'Design', membreNom:'Rawen Zgarni'  },
  ];

  constructor(private tacheService: TacheService, private userService: UtilisateurService, private fb: FormBuilder) {
    this.form = this.fb.group({
      titre:       ['', Validators.required],
      description: [''],
      dateDebut:   ['', Validators.required],
      dateFin:     ['', Validators.required],
      priorite:    ['NORMALE'],
      membreId:    [null],
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.tacheService.getByComite(2).subscribe({
      next: t => { this.taches = t; this.loading = false; },
      error: () => { this.taches = this.mockTaches; this.loading = false; }
    });
    this.userService.getAll().subscribe({
      next: (p: User[]) => this.membres = p.filter((u: User) => u.role === 'MEMBRE'),
      error: () => {}
    });
  }

  get filtered(): Tache[] {
    return this.filterStatut === 'TOUS' ? this.taches : this.taches.filter(t => t.statut === this.filterStatut);
  }

  countByStatut(s: string): number {
    return s === 'TOUS' ? this.taches.length : this.taches.filter(t => t.statut === s).length;
  }

  openCreate(): void { this.editMode = false; this.editId = null; this.form.reset({ priorite:'NORMALE' }); this.showModal = true; }

  openEdit(t: Tache): void { this.editMode = true; this.editId = t.id; this.form.patchValue(t); this.showModal = true; }

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
      error: () => t.statut = statut as any
    });
  }

  confirmDel(id: number): void { this.deleteId = id; this.confirmDelete = true; }
  doDelete(): void {
    this.tacheService.delete(this.deleteId!).subscribe({
      next: () => { this.confirmDelete = false; this.load(); },
      error: () => { this.confirmDelete = false; this.load(); }
    });
  }

  get f() { return this.form.controls; }
}
