/* src/app/features/pilotage/dashboard/pilotage-dashboard.component.ts */
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StatistiquesService, TacheService } from '../../../core/services/api.services';
import { KPIs, AvancementComite, Tache } from '../../../core/models';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-pilotage-dashboard',
  templateUrl: './pilotage-dashboard.component.html',
  styleUrls: ['./pilotage-dashboard.component.scss'],
})
export class PilotageDashboardComponent implements OnInit, AfterViewInit {
  kpis: KPIs | null = null;
  avancements: AvancementComite[] = [];
  tachesRetard: Tache[] = [];

  private mockAv: AvancementComite[] = [
    { comiteNom: 'Design',     total: 38, terminees: 35, avancement: 92 },
    { comiteNom: 'Sponsoring', total: 32, terminees: 25, avancement: 78 },
    { comiteNom: 'Logistique', total: 40, terminees: 26, avancement: 65 },
    { comiteNom: 'Programme',  total: 30, terminees: 24, avancement: 80 },
    { comiteNom: 'Média',      total: 35, terminees: 19, avancement: 55 },
    { comiteNom: 'Projet',     total: 25, terminees: 9,  avancement: 38 },
  ];

  constructor(private stats: StatistiquesService, private tacheService: TacheService) {}

  ngOnInit(): void {
    this.stats.getKPIs().subscribe({ next: k => this.kpis = k, error: () => this.kpis = { totalUtilisateurs:48,totalTaches:200,tachesTerminees:108,tachesEnRetard:12,totalWorkshops:18,workshopsValides:11,totalCandidatures:87,avancementGlobal:54 } });
    this.stats.getAvancementComites().subscribe({ next: a => this.avancements = a, error: () => this.avancements = this.mockAv });
    this.tacheService.getAll({ statut: 'EN_RETARD' }).subscribe({ next: t => this.tachesRetard = t.slice(0, 5), error: () => this.tachesRetard = [] });
  }

  ngAfterViewInit(): void { setTimeout(() => this.buildChart(), 300); }

  buildChart(): void {
    const el = document.getElementById('chartAv') as HTMLCanvasElement;
    if (!el) return;
    new Chart(el, {
      type: 'bar',
      data: {
        labels: this.mockAv.map(a => a.comiteNom),
        datasets: [
          { label: 'Terminées', data: this.mockAv.map(a => a.terminees), backgroundColor: '#10B981', borderRadius: 6 },
          { label: 'Restantes', data: this.mockAv.map(a => a.total - a.terminees), backgroundColor: '#F1F5F9', borderRadius: 6 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } },
        scales: { x: { stacked: true }, y: { stacked: true } },
      },
    });
  }

  statusColor(s: string): string { return { A_FAIRE:'a-faire',EN_COURS:'en-cours',TERMINEE:'terminee',EN_RETARD:'en-retard' }[s] ?? ''; }
}
