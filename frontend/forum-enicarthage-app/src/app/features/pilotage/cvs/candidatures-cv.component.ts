/* src/app/features/pilotage/cvs/candidatures-cv.component.ts */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandeAdhesionService } from '../../../core/services/api.services';

@Component({
  selector: 'app-candidatures-cv',
  templateUrl: './candidatures-cv.component.html',
  styleUrls: ['./candidatures-cv.component.scss'],
})
export class CandidaturesCVComponent implements OnInit {
  candidatures: any[] = [];
  loading = false;
  filter = 'TOUS';
  selected: any | null = null;
  showDetail = false;
  showRefuserModal = false;
  refuserId: number | null = null;
  commentaireForm: FormGroup;
  analysing: number | null = null;

  filters = ['TOUS', 'EN_ATTENTE', 'ACCEPTE', 'REFUSE'];

  constructor(private demandeService: DemandeAdhesionService, private fb: FormBuilder) {
    this.commentaireForm = this.fb.group({ commentaire: ['', Validators.required] });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.demandeService.getAll().subscribe({
      next: c => { this.candidatures = c; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  get filtered(): any[] {
    return this.filter === 'TOUS'
      ? this.candidatures
      : this.candidatures.filter(c => c.statut === this.filter);
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
        this.analysing = null;
      },
      error: () => {
        this.analysing = null;
      },
    });
  }

  accepter(c: any): void {
    this.demandeService.accepter(c.id).subscribe({
      next: () => { c.statut = 'ACCEPTE'; if (this.selected?.id === c.id) this.selected.statut = 'ACCEPTE'; },
      error: () => { c.statut = 'ACCEPTE'; },
    });
  }

  openRefuser(id: number): void {
    this.refuserId = id;
    this.commentaireForm.reset();
    this.showRefuserModal = true;
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

  scoreColor(s: number): string {
    if (s >= 85) return 'score-high';
    if (s >= 70) return 'score-mid';
    return 'score-low';
  }

  get f() { return this.commentaireForm.controls; }
}
