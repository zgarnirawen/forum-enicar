import { Component, OnInit } from '@angular/core';
import { DemandeAdhesionService } from '../../../core/services/api.services';

@Component({
  selector: 'app-module-ia',
  templateUrl: './module-ia.component.html',
  styleUrls: ['./module-ia.component.scss'],
})
export class ModuleIAComponent implements OnInit {
  candidatures: any[] = [];
  loading = false;
  analysing = false;

  constructor(private demandeService: DemandeAdhesionService) {}

  ngOnInit(): void {
    this.demandeService.getAll().subscribe({
      next: (c: any[]) => this.candidatures = c.sort((a, b) => (b.scoreIA || 0) - (a.scoreIA || 0)),
      error: () => {},
    });
  }

  analyserTous(): void {
    this.analysing = true;
    setTimeout(() => this.analysing = false, 2000);
  }

  scoreColor(s: number): string {
    if (s >= 85) return '#10B981';
    if (s >= 70) return '#F59E0B';
    return '#EF4444';
  }

  scoreBg(s: number): string {
    if (s >= 85) return '#D1FAE5';
    if (s >= 70) return '#FEF3C7';
    return '#FEE2E2';
  }

  justification(c: any): string {
    const s = c.scoreIA;
    if (s >= 85) return 'Profil excellent — compétences très alignées avec le poste.';
    if (s >= 70) return 'Bon profil — quelques points à approfondir en entretien.';
    return 'Profil insuffisant — compétences peu alignées avec le poste.';
  }
}
