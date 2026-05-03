import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TacheService } from '../../../core/services/api.services';
import { Tache, StatutTache } from '../../../core/models';

@Component({
  selector: 'app-membre-taches',
  templateUrl: './membre-taches.component.html',
  styleUrls: ['./membre-taches.component.scss'],
})
export class MembreTachesComponent implements OnInit {
  taches: Tache[] = [];
  loading = false;
  actionMsg = '';
  filterStatut: StatutTache | 'TOUS' = 'TOUS';
  showDetail = false;
  selectedTache: Tache | null = null;
  commentForm: FormGroup;
  submittingComment = false;
  updatingStatut: number | null = null;

  allFilters: (StatutTache | 'TOUS')[] = ['TOUS', 'A_FAIRE', 'EN_COURS', 'TERMINEE'];

  mockTaches: Tache[] = [
    { id:1, titre:'Bannières réseaux sociaux', description:'Formats LinkedIn, IG, FB', dateDebut:'2025-02-15', dateFin:'2025-03-20', priorite:'NORMALE', statut:'EN_COURS',  comiteNom:'Design' },
    { id:2, titre:'Kit de bienvenue PDF',      description:'Brochure entreprises',     dateDebut:'2025-03-01', dateFin:'2025-04-01', priorite:'NORMALE', statut:'A_FAIRE',   comiteNom:'Design' },
    { id:3, titre:'Charte graphique',          description:'Palette couleurs et typos',dateDebut:'2025-01-10', dateFin:'2025-02-01', priorite:'URGENTE', statut:'TERMINEE',  comiteNom:'Design' },
  ];

  constructor(private tacheService: TacheService, private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      contenu: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.tacheService.getMesTaches().subscribe({
      next: t => { this.taches = t; this.loading = false; },
      error: () => { this.taches = this.mockTaches; this.loading = false; }
    });
  }

  // FIX: EN_RETARD cannot be set manually (blocked by backend)
  changerStatut(t: Tache, statut: StatutTache): void {
    if (statut === 'EN_RETARD') return;
    this.updatingStatut = t.id;
    this.tacheService.changerStatut(t.id, statut).subscribe({
      next: updated => { t.statut = updated.statut; this.actionMsg = 'Statut mis à jour'; this.updatingStatut = null; },
      error: () => { t.statut = statut; this.actionMsg = 'Mis à jour (mode test)'; this.updatingStatut = null; }
    });
    setTimeout(() => this.actionMsg = '', 3000);
  }

  get filtered(): Tache[] {
    return this.filterStatut === 'TOUS' ? this.taches : this.taches.filter(t => t.statut === this.filterStatut);
  }

  countByStatut(s: StatutTache | 'TOUS'): number {
    return s === 'TOUS' ? this.taches.length : this.taches.filter(t => t.statut === s).length;
  }

  nextStatut(current: StatutTache): StatutTache {
    const order: StatutTache[] = ['A_FAIRE', 'EN_COURS', 'TERMINEE'];
    const idx = order.indexOf(current);
    return idx < order.length - 1 ? order[idx + 1] : current;
  }

  openDetail(t: Tache): void {
    this.selectedTache = t;
    this.showDetail = true;
  }

  addComment(): void {
    if (this.commentForm.invalid || !this.selectedTache) return;
    this.submittingComment = true;
    this.tacheService.ajouterCommentaire(this.selectedTache.id, this.commentForm.value.contenu).subscribe({
      next: () => {
        if (this.selectedTache) {
          if (!this.selectedTache.commentaires) this.selectedTache.commentaires = [];
          this.selectedTache.commentaires.push({
            id: Math.random(),
            contenu: this.commentForm.value.contenu,
            auteurId: 0,
            auteurNom: 'Vous'
          });
        }
        this.commentForm.reset();
        this.submittingComment = false;
      },
      error: () => {
        this.submittingComment = false;
      }
    });
  }

  get statutsDisponibles(): StatutTache[] {
    return ['A_FAIRE', 'EN_COURS', 'TERMINEE'];
  }
}
