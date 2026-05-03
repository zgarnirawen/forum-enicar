import { Component, OnInit } from '@angular/core';
import { StatistiquesService } from '../../../core/services/api.services';
import { AvancementComite } from '../../../core/models';

@Component({
  selector: 'app-avancement',
  template: `
    <app-layout title="Avancement des comités" subtitle="État en temps réel de chaque comité">
      <div class="loading-state" *ngIf="loading"><div class="spinner-lg"></div></div>
      <div class="card" *ngIf="!loading">
        <table class="data-table">
          <thead><tr>
            <th>Comité</th><th>Total tâches</th><th>Terminées</th><th>Avancement</th>
          </tr></thead>
          <tbody>
            <tr *ngFor="let a of avancements">
              <td><strong>{{ a.comiteNom }}</strong></td>
              <td>{{ a.total }}</td>
              <td>{{ a.terminees }}</td>
              <td>
                <div class="progress-wrap">
                  <div class="progress-bar">
                    <div class="progress-fill"
                         [style.width.%]="a.avancement"
                         [class.low]="a.avancement < 50"
                         [class.mid]="a.avancement >= 50 && a.avancement < 80"
                         [class.high]="a.avancement >= 80">
                    </div>
                  </div>
                  <span class="progress-val">{{ a.avancement }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </app-layout>
  `
})
export class AvancementComponent implements OnInit {
  avancements: AvancementComite[] = [];
  loading = false;

  mock: AvancementComite[] = [
    { comiteNom:'Design',     total:38, terminees:35, avancement:92 },
    { comiteNom:'Sponsoring', total:32, terminees:25, avancement:78 },
    { comiteNom:'Logistique', total:40, terminees:26, avancement:65 },
    { comiteNom:'Programme',  total:30, terminees:24, avancement:80 },
    { comiteNom:'Média',      total:35, terminees:19, avancement:55 },
    { comiteNom:'Projet',     total:25, terminees:9,  avancement:38 },
  ];

  constructor(private statsService: StatistiquesService) {}

  ngOnInit(): void {
    this.loading = true;
    this.statsService.getAvancementComites().subscribe({
      next: a => { this.avancements = a; this.loading = false; },
      error: () => { this.avancements = this.mock; this.loading = false; }
    });
  }
}
