import { Component, OnInit } from '@angular/core';
import { ForumProjectService } from '../../../core/services/api.services';
import { ForumProject } from '../../../core/models';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss'],
})
export class HistoriqueComponent implements OnInit {
  projets: ForumProject[] = [];
  loading = false;
  selected: ForumProject | null = null;

  constructor(private projectService: ForumProjectService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.projectService.getHistorique().subscribe({
      next: p => { this.projets = p; this.loading = false; },
      error: () => {
        // Données de démonstration si le backend est inaccessible
        this.projets = [
          {
            id: 2, nom: 'Forum ENICarthage 2024', edition: '2024',
            dateDebut: '2024-01-10', dateEvenement: '2024-04-15',
            lieu: 'ENICarthage, Ariana', description: '60+ entreprises, 800+ étudiants',
            statut: 'CLOTURE',
          },
          {
            id: 1, nom: 'Forum ENICarthage 2023', edition: '2023',
            dateDebut: '2023-01-15', dateEvenement: '2023-04-20',
            lieu: 'ENICarthage, Ariana', description: '50+ entreprises partenaires',
            statut: 'CLOTURE',
          },
        ];
        this.loading = false;
      },
    });
  }

  open(p: ForumProject): void { this.selected = p; }
  close(): void { this.selected = null; }

  statutColor(s: string): string {
    return { PLANIFICATION: 'planif', EN_COURS: 'encours', CLOTURE: 'cloture' }[s] ?? '';
  }
}
