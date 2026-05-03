import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StatistiquesService } from '../../../core/services/api.services';
import { KPIs, AvancementComite } from '../../../core/models';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  kpis: KPIs | null = null;
  avancements: AvancementComite[] = [];
  loading = true;

  // Données mock en cas d'erreur backend
  private mockKPIs: KPIs = {
    totalUtilisateurs: 48, totalTaches: 200,
    tachesTerminees: 108, tachesEnRetard: 12,
    totalWorkshops: 18, workshopsValides: 11,
    totalCandidatures: 87, avancementGlobal: 54,
  };

  private mockAvancements: AvancementComite[] = [
    { comiteNom: 'Design',      total: 38, terminees: 35, avancement: 92 },
    { comiteNom: 'Sponsoring',  total: 32, terminees: 25, avancement: 78 },
    { comiteNom: 'Logistique',  total: 40, terminees: 26, avancement: 65 },
    { comiteNom: 'Programme',   total: 30, terminees: 24, avancement: 80 },
    { comiteNom: 'Média',       total: 35, terminees: 19, avancement: 55 },
    { comiteNom: 'Projet',      total: 25, terminees: 9,  avancement: 38 },
  ];

  constructor(private statsService: StatistiquesService) {}

  ngOnInit(): void {
    this.statsService.getKPIs().subscribe({
      next: (k) => { this.kpis = k; this.loading = false; },
      error: () => { this.kpis = this.mockKPIs; this.loading = false; },
    });
    this.statsService.getAvancementComites().subscribe({
      next: (a) => { this.avancements = a; },
      error: () => { this.avancements = this.mockAvancements; },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.buildCharts(), 300);
  }

  buildCharts(): void {
    // Bar chart comités
    const c1 = document.getElementById('chartComites') as HTMLCanvasElement;
    if (c1) {
      new Chart(c1, {
        type: 'bar',
        data: {
          labels: this.mockAvancements.map(a => a.comiteNom),
          datasets: [{
            label: 'Avancement %',
            data: this.mockAvancements.map(a => a.avancement),
            backgroundColor: ['#10B981','#1E40AF','#F59E0B','#1E40AF','#F59E0B','#EF4444'],
            borderRadius: 8, barThickness: 32,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { min: 0, max: 100, ticks: { callback: (v) => v + '%' } } },
        },
      });
    }
    // Doughnut tâches
    const c2 = document.getElementById('chartTaches') as HTMLCanvasElement;
    if (c2) {
      new Chart(c2, {
        type: 'doughnut',
        data: {
          labels: ['À faire', 'En cours', 'Terminées', 'En retard'],
          datasets: [{
            data: [28, 52, 108, 12],
            backgroundColor: ['#E2E8F0', '#1E40AF', '#10B981', '#EF4444'],
            borderWidth: 0, hoverOffset: 6,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } } },
          cutout: '68%',
        },
      });
    }
  }

  get tachesPercent(): number {
    if (!this.kpis) return 0;
    return Math.round((this.kpis.tachesTerminees / this.kpis.totalTaches) * 100);
  }
}
