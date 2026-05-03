import { Component, OnInit } from '@angular/core';
import { TacheService, ComiteService } from '../../../core/services/api.services';
import { Tache, Comite } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-chef-dashboard',
  templateUrl: './chef-dashboard.component.html',
  styleUrls: ['./chef-dashboard.component.scss'],
})
export class ChefDashboardComponent implements OnInit {
  comite: Comite | null = null;
  taches: Tache[] = [];

  mockTaches: Tache[] = [
    { id:1, titre:'Affiche principale Forum',   description:'Design A3 pour impression', dateDebut:'2025-02-01', dateFin:'2025-03-10', priorite:'URGENTE', statut:'TERMINEE',  comiteId:2, comiteNom:'Design', membreNom:'Rawen Zgarni'   },
    { id:2, titre:'Bannières réseaux sociaux',  description:'Formats LinkedIn, IG, FB',  dateDebut:'2025-02-15', dateFin:'2025-03-20', priorite:'NORMALE', statut:'EN_COURS',  comiteId:2, comiteNom:'Design', membreNom:'Ali Mansour'    },
    { id:3, titre:'Kit de bienvenue PDF',       description:'Brochure entreprises',      dateDebut:'2025-03-01', dateFin:'2025-04-01', priorite:'NORMALE', statut:'A_FAIRE',   comiteId:2, comiteNom:'Design', membreNom:'Sara Trabelsi'  },
    { id:4, titre:'Vidéo teaser 60s',           description:'Motion design du Forum',    dateDebut:'2025-03-15', dateFin:'2025-04-10', priorite:'URGENTE', statut:'EN_RETARD', comiteId:2, comiteNom:'Design', membreNom:'Lina Mrad'      },
  ];

  constructor(
    private tacheService: TacheService,
    private comiteService: ComiteService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.comiteService.getMonComite().subscribe({
      next: c => this.comite = c,
      error: () => this.comite = { id:2, nom:'Design', description:'Identité visuelle et communication graphique du Forum', chefNom:'Rawen Zgarni', avancement:72, nombreTaches:38 }
    });
    this.tacheService.getByComite(2).subscribe({
      next: t => this.taches = t,
      error: () => this.taches = this.mockTaches
    });
  }

  get dernieresToughes(): Tache[] { return this.taches.slice(0, 4); }
  get aFaire():   number { return this.taches.filter(t => t.statut === 'A_FAIRE').length; }
  get enCours():  number { return this.taches.filter(t => t.statut === 'EN_COURS').length; }
  get terminees():number { return this.taches.filter(t => t.statut === 'TERMINEE').length; }
  get enRetard(): number { return this.taches.filter(t => t.statut === 'EN_RETARD').length; }
}
