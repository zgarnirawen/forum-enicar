import { Component, OnInit } from '@angular/core';
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
  ) {}

  ngOnInit(): void {
    this.comiteId  = this.auth.currentUser?.comiteId ?? 0;
    this.comiteNom = this.auth.currentUser?.nom ?? '';
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
    // Récupère les candidatures MEMBRE du comité via le flux DemandeAdhesion (avec score IA)
    this.demandeService.getAll().subscribe({
      next: (all: any[]) => {
        this.candidaturesIA = all
          .filter(c => c.posteVise === 'MEMBRE' && c.statut === 'EN_ATTENTE')
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
        c.statut = 'ACCEPTE';
        this.candidaturesIA = this.candidaturesIA.filter(x => x.id !== c.id);
      },
      error: () => {},
    });
  }

  refuserCandidature(c: any, commentaire: string): void {
    this.demandeService.refuser(c.id, commentaire).subscribe({
      next: () => {
        c.statut = 'REFUSE';
        this.candidaturesIA = this.candidaturesIA.filter(x => x.id !== c.id);
      },
      error: () => {},
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
}
