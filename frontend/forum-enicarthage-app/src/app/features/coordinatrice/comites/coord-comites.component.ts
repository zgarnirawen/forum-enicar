import { Component, OnInit } from '@angular/core';
import { ComiteService, TacheService } from '../../../core/services/api.services';
import { Comite } from '../../../core/models';

@Component({
  selector: 'app-coord-comites',
  template: `
    <app-layout title="Supervision des comités" subtitle="Vue consolidée de tous les comités">
      <div class="loading-state" *ngIf="loading"><div class="spinner-lg"></div></div>
      <div class="comites-grid" *ngIf="!loading">
        <div class="comite-card" *ngFor="let c of comites">
          <div class="comite-header">
            <h3>Comité {{ c.nom }}</h3>
            <span class="badge" [class.badge-green]="c.avancement! >= 80" [class.badge-amber]="c.avancement! >= 50 && c.avancement! < 80" [class.badge-red]="c.avancement! < 50">{{ c.avancement }}%</span>
          </div>
          <p>{{ c.description }}</p>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="c.avancement"
              [class.low]="c.avancement! < 50" [class.mid]="c.avancement! >= 50 && c.avancement! < 80" [class.high]="c.avancement! >= 80">
            </div>
          </div>
          <div class="comite-meta">
            <span>👑 {{ c.chefNom || 'Non assigné' }}</span>
            <span>📋 {{ c.nombreTaches }} tâches</span>
            <span>👥 {{ c.nombreMembres }} membres</span>
          </div>
        </div>
      </div>
    </app-layout>
  `
})
export class CoordComitesComponent implements OnInit {
  comites: Comite[] = [];
  loading = false;

  mockComites: Comite[] = [
    { id:1, nom:'DESIGN',     description:'Identité visuelle', chefNom:'Rawen Zgarni',  avancement:92, nombreTaches:38, nombreMembres:8 },
    { id:2, nom:'SPONSORING', description:'Relations entreprises', chefNom:'Ahmed Ben Ali', avancement:78, nombreTaches:32, nombreMembres:6 },
    { id:3, nom:'LOGISTIQUE', description:'Organisation matérielle', chefNom:'Sara Trabelsi', avancement:65, nombreTaches:40, nombreMembres:10 },
    { id:4, nom:'PROGRAMME',  description:'Planning des sessions', chefNom:'Youssef Hamdi', avancement:80, nombreTaches:30, nombreMembres:7 },
    { id:5, nom:'MEDIA',      description:'Couverture événement', chefNom:'Lina Mrad', avancement:55, nombreTaches:35, nombreMembres:9 },
    { id:6, nom:'PROJET',     description:'Coordination générale', chefNom:'Sarra Ben Haj', avancement:38, nombreTaches:25, nombreMembres:5 },
  ];

  constructor(private comiteService: ComiteService) {}

  ngOnInit(): void {
    this.loading = true;
    this.comiteService.getAll().subscribe({
      next: c => { this.comites = c; this.loading = false; },
      error: () => { this.comites = this.mockComites; this.loading = false; }
    });
  }
}
