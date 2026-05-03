import { Component, OnInit } from '@angular/core';
import { MembreService } from '../../../core/services/api.services';
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
  loading = false;
  private comiteId!: number;

  mockDemandesEnAttente: Membre[] = [
    { id:20, utilisateurId:100, nom:'Karim Belhaj', email:'karim@enicarthage.tn', comiteId:1, comiteNom:'Design', statut:'EN_ATTENTE' },
    { id:21, utilisateurId:101, nom:'Nour Hamdi',   email:'nour@enicarthage.tn',  comiteId:1, comiteNom:'Design', statut:'EN_ATTENTE' },
  ];
  mockMembresAcceptes: Membre[] = [
    { id:10, utilisateurId:10, nom:'Ali Mansour',   email:'ali@enicarthage.tn',  comiteId:1, comiteNom:'Design', statut:'ACCEPTE', dateAdhesion:'2025-01-15T10:00:00' },
    { id:11, utilisateurId:11, nom:'Sara Trabelsi', email:'sara@enicarthage.tn', comiteId:1, comiteNom:'Design', statut:'ACCEPTE', dateAdhesion:'2025-01-20T09:00:00' },
  ];

  constructor(private membreService: MembreService, private auth: AuthService) {}

  ngOnInit(): void {
    // FIX: comiteId comes from JWT claim (auth.currentUser.comiteId)
    this.comiteId = this.auth.currentUser?.comiteId ?? 0;
    this.load();
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

  accepter(membreId: number): void {
    this.membreService.accepter(membreId).subscribe({
      next: () => this.load(),
      error: () => {
        // Mock: move from pending to accepted
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

  initials(nom: string): string {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  get membres(): Membre[] {
    return this.membresAcceptes;
  }

  retirer(membreId: number): void {
    this.membreService.refuser(membreId).subscribe({
      next: () => this.load(),
      error: () => { this.membresAcceptes = this.membresAcceptes.filter(m => m.id !== membreId); }
    });
  }
}
