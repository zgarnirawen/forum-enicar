import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MembreService, DemandeAdhesionService } from '../../../core/services/api.services';
import { AuthService } from '../../../core/services/auth.service';
import { Membre } from '../../../core/models';

@Component({
  selector: 'app-chef-membres',
  templateUrl: './chef-membres.component.html',
  styleUrls: ['./chef-membres.component.scss'],
})
export class ChefMembresComponent implements OnInit {
  demandesEnAttente: Membre[] = [];
  membresAcceptes: Membre[] = [];
  candidaturesIA: any[] = [];
  loading = false;
  showRefuserModal = false;
  refuserTarget: any | null = null;
  refuserErreur = '';
  commentaireForm: FormGroup;
  private comiteId!: number;
  private comiteNom = '';

  mockDemandesEnAttente: Membre[] = [
    { id:20, utilisateurId:100, nom:'Karim Belhaj', email:'karim@enicarthage.tn', comiteId:1, comiteNom:'Design', statut:'EN_ATTENTE' },
    { id:21, utilisateurId:101, nom:'Nour Hamdi',   email:'nour@enicarthage.tn',  comiteId:1, comiteNom:'Design', statut:'EN_ATTENTE' },
  ];
  mockMembresAcceptes: Membre[] = [
    { id:10, utilisateurId:10, nom:'Ali Mansour',   email:'ali@enicarthage.tn',  comiteId:1, comiteNom:'Design', statut:'ACCEPTE', dateAdhesion:'2025-01-15T10:00:00' },
    { id:11, utilisateurId:11, nom:'Sara Trabelsi', email:'sara@enicarthage.tn', comiteId:1, comiteNom:'Design', statut:'ACCEPTE', dateAdhesion:'2025-01-20T09:00:00' },
  ];

  constructor(
    private membreService: MembreService,
    private demandeService: DemandeAdhesionService,
    private auth: AuthService,
    private fb: FormBuilder,
  ) {
    this.commentaireForm = this.fb.group({ commentaire: ['', Validators.required] });
  }

  ngOnInit(): void {
    this.comiteId  = this.auth.currentUser?.comiteId ?? 0;
    this.comiteNom = (this.auth.currentUser as any)?.comiteNom ?? '';
    this.load();
    this.loadCandidaturesIA();
  }

  load(): void {
    this.loading = true;
    this.membreService.getDemandesEnAttente(this.comiteId).subscribe({
      next: d => { this.demandesEnAttente = d; this.loading = false; },
      error: () => { this.demandesEnAttente = this.mockDemandesEnAttente; this.loading = false; }
    });
    this.membreService.getMembresAcceptes(this.comiteId).subscribe({
      next: m => this.membresAcceptes = m,
      error: () => this.membresAcceptes = this.mockMembresAcceptes
    });
  }

  loadCandidaturesIA(): void {
    this.demandeService.getAll().subscribe({
      next: (all: any[]) => {
        this.candidaturesIA = all
          .filter(c =>
            c.posteVise === 'MEMBRE' &&
            c.statut === 'EN_ATTENTE' &&
            // Ne montrer que les candidatures pour ce comité (si précisé)
            (!this.comiteNom || !c.comiteVise || c.comiteVise === this.comiteNom)
          )
          .sort((a, b) => (b.scoreIA || 0) - (a.scoreIA || 0));
      },
      error: () => { this.candidaturesIA = []; },
    });
  }

  accepter(membreId: number): void {
    this.membreService.accepter(membreId).subscribe({
      next: () => this.load(),
      error: () => {
        const idx = this.demandesEnAttente.findIndex(d => d.id === membreId);
        if (idx >= 0) {
          const m = { ...this.demandesEnAttente[idx], statut: 'ACCEPTE' as const };
          this.membresAcceptes.push(m);
          this.demandesEnAttente.splice(idx, 1);
        }
      }
    });
  }

  refuser(membreId: number): void {
    this.membreService.refuser(membreId).subscribe({
      next: () => this.load(),
      error: () => { this.demandesEnAttente = this.demandesEnAttente.filter(d => d.id !== membreId); }
    });
  }

  accepterCandidature(c: any): void {
    this.demandeService.accepter(c.id).subscribe({
      next: () => {
        this.candidaturesIA = this.candidaturesIA.filter(x => x.id !== c.id);
      },
      error: () => {},
    });
  }

  openRefuserCandidature(c: any): void {
    this.refuserTarget = c;
    this.commentaireForm.reset();
    this.refuserErreur = '';
    this.showRefuserModal = true;
  }

  doRefuserCandidature(): void {
    if (this.commentaireForm.invalid) return;
    this.demandeService.refuser(this.refuserTarget.id, this.commentaireForm.value.commentaire).subscribe({
      next: () => {
        this.candidaturesIA = this.candidaturesIA.filter(x => x.id !== this.refuserTarget.id);
        this.showRefuserModal = false;
      },
      error: () => {
        this.refuserErreur = 'Erreur lors du refus. Veuillez réessayer.';
      },
    });
  }

  initials(nom: string): string {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  get membres(): Membre[] { return this.membresAcceptes; }

  retirer(membreId: number): void {
    this.membreService.refuser(membreId).subscribe({
      next: () => this.load(),
      error: () => { this.membresAcceptes = this.membresAcceptes.filter(m => m.id !== membreId); }
    });
  }

  scoreColor(s: number): string {
    if (s >= 85) return 'score-high';
    if (s >= 70) return 'score-mid';
    return 'score-low';
  }

  cvUrl(c: any): string { return this.demandeService.telechargerCV(c.id); }

  get f() { return this.commentaireForm.controls; }
}
