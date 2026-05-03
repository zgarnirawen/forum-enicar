/* src/app/features/coordinatrice/candidatures/coord-candidatures.component.ts */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandeAdhesionService, ConfigurationService } from '../../../core/services/api.services';

@Component({
  selector: 'app-coord-candidatures',
  templateUrl: './coord-candidatures.component.html',
  styleUrls: ['./coord-candidatures.component.scss'],
})
export class CoordCandidaturesComponent implements OnInit {
  candidatures: any[] = [];
  loading = false;
  filter = 'TOUS';
  filterPoste = 'TOUS';
  selected: any | null = null;
  showDetail = false;
  showRefuserModal = false;
  refuserId: number | null = null;
  analysing: number | null = null;
  commentaireForm: FormGroup;

  phaseActive = '';
  phaseLoading = false;
  phases = [
    { id: 'PHASE_1_COORDINATRICE', label: '1 — Coordinatrice Générale' },
    { id: 'PHASE_2_CHEFS',         label: '2 — Chefs de Comité' },
    { id: 'PHASE_3_MEMBRES',       label: '3 — Membres de Comité' },
    { id: 'TERMINE',               label: '✓ Recrutement terminé' },
  ];

  filters  = ['TOUS', 'EN_ATTENTE', 'ACCEPTE', 'REFUSE'];
  postes   = ['TOUS', 'COORDINATRICE', 'CHEF_COMITE', 'MEMBRE'];

  constructor(
    private demandeService: DemandeAdhesionService,
    private configService: ConfigurationService,
    private fb: FormBuilder,
  ) {
    this.commentaireForm = this.fb.group({ commentaire: ['', Validators.required] });
  }

  ngOnInit(): void {
    this.load();
    this.loadPhase();
  }

  load(): void {
    this.loading = true;
    this.demandeService.getAll().subscribe({
      next: c => { this.candidatures = c; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  loadPhase(): void {
    this.configService.getConfiguration().subscribe({
      next: cfg => this.phaseActive = cfg.phaseRecrutementActive,
      error: () => {},
    });
  }

  setPhase(phase: string): void {
    this.phaseLoading = true;
    this.configService.setPhase(phase).subscribe({
      next: cfg => { this.phaseActive = cfg.phaseRecrutementActive; this.phaseLoading = false; },
      error: () => { this.phaseLoading = false; },
    });
  }

  get filtered(): any[] {
    return this.candidatures.filter(c =>
      (this.filter      === 'TOUS' || c.statut    === this.filter) &&
      (this.filterPoste === 'TOUS' || c.posteVise === this.filterPoste)
    );
  }

  statutCount(f: string): number {
    return f === 'TOUS'
      ? this.candidatures.length
      : this.candidatures.filter(c => c.statut === f).length;
  }

  analyserIA(c: any): void {
    this.analysing = c.id;
    this.demandeService.analyserIA(c.id).subscribe({
      next: updated => {
        const idx = this.candidatures.findIndex((x: any) => x.id === updated.id);
        if (idx >= 0) this.candidatures[idx] = updated;
        if (this.selected?.id === updated.id) this.selected = updated;
        this.analysing = null;
      },
      error: () => { this.analysing = null; },
    });
  }

  accepter(c: any): void {
    this.demandeService.accepter(c.id).subscribe({
      next: () => {
        c.statut = 'ACCEPTE';
        if (this.selected?.id === c.id) this.selected.statut = 'ACCEPTE';
        this.showDetail = false;
      },
      error: () => {},
    });
  }

  openRefuser(id: number): void {
    this.refuserId = id;
    this.commentaireForm.reset();
    this.showRefuserModal = true;
    this.showDetail = false;
  }

  doRefuser(): void {
    if (this.commentaireForm.invalid) return;
    this.demandeService.refuser(this.refuserId!, this.commentaireForm.value.commentaire).subscribe({
      next: () => { this.setRefuse(); },
      error: () => { this.setRefuse(); },
    });
  }

  private setRefuse(): void {
    const c = this.candidatures.find(x => x.id === this.refuserId);
    if (c) c.statut = 'REFUSE';
    this.showRefuserModal = false;
  }

  openDetail(c: any): void { this.selected = c; this.showDetail = true; }

  cvUrl(c: any): string { return this.demandeService.telechargerCV(c.id); }

  scoreColor(s: number): string {
    if (s >= 85) return 'score-high';
    if (s >= 70) return 'score-mid';
    return 'score-low';
  }

  get f() { return this.commentaireForm.controls; }

  phaseLabel(phase: string): string {
    return this.phases.find(p => p.id === phase)?.label ?? phase;
  }
}
