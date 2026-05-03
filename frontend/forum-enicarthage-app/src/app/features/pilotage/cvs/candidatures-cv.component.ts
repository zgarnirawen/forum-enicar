/* src/app/features/pilotage/cvs/candidatures-cv.component.ts */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidatureCVService } from '../../../core/services/api.services';
import { CandidatureCV } from '../../../core/models';

@Component({
  selector: 'app-candidatures-cv',
  templateUrl: './candidatures-cv.component.html',
  styleUrls: ['./candidatures-cv.component.scss'],
})
export class CandidaturesCVComponent implements OnInit {
  candidatures: CandidatureCV[] = [];
  loading = false;
  filter = 'TOUS';
  selected: CandidatureCV | null = null;
  showDetail = false;
  showRefuserModal = false;
  refuserId: number | null = null;
  commentaireForm: FormGroup;
  analysing: number | null = null;

  filters = ['TOUS', 'EN_ATTENTE', 'ACCEPTE', 'REFUSE'];

  mockData: CandidatureCV[] = [
    { id: 1, candidatNom: 'Ali Mansour',    candidatEmail: 'ali@gmail.com',     posteVise: 'Chef Comite Design',      scoreIA: 87, statut: 'EN_ATTENTE', dateDepot: '2025-03-01', fichierCV: 'cv_ali.pdf',     candidatId: 10 },
    { id: 2, candidatNom: 'Sara Trabelsi',  candidatEmail: 'sara@gmail.com',    posteVise: 'Coordinatrice Generale',  scoreIA: 94, statut: 'EN_ATTENTE', dateDepot: '2025-03-03', fichierCV: 'cv_sara.pdf',    candidatId: 11 },
    { id: 3, candidatNom: 'Youssef Hamdi',  candidatEmail: 'youssef@gmail.com', posteVise: 'Chef Comite Logistique',  scoreIA: 72, statut: 'ACCEPTE',    dateDepot: '2025-02-28', fichierCV: 'cv_youssef.pdf', candidatId: 12 },
    { id: 4, candidatNom: 'Lina Mrad',      candidatEmail: 'lina@gmail.com',    posteVise: 'Chef Comite Media',       scoreIA: 65, statut: 'REFUSE',     dateDepot: '2025-02-25', fichierCV: 'cv_lina.pdf',    candidatId: 13 },
    { id: 5, candidatNom: 'Karim Belhaj',   candidatEmail: 'karim@gmail.com',   posteVise: 'Chef Comite Programme',   scoreIA: 81, statut: 'EN_ATTENTE', dateDepot: '2025-03-05', fichierCV: 'cv_karim.pdf',   candidatId: 14 },
  ];

  constructor(private cvService: CandidatureCVService, private fb: FormBuilder) {
    this.commentaireForm = this.fb.group({ commentaire: ['', Validators.required] });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.cvService.getAll().subscribe({
      next: c => { this.candidatures = c; this.loading = false; },
      error: () => { this.candidatures = this.mockData; this.loading = false; },
    });
  }

  get filtered(): CandidatureCV[] {
    return this.filter === 'TOUS'
      ? this.candidatures
      : this.candidatures.filter(c => c.statut === this.filter);
  }

  statutCount(f: string): number {
    return f === 'TOUS'
      ? this.candidatures.length
      : this.candidatures.filter(c => c.statut === f).length;
  }

  analyserIA(c: CandidatureCV): void {
    this.analysing = c.id;
    this.cvService.analyserIA(c.id).subscribe({
      next: updated => {
        const idx = this.candidatures.findIndex(x => x.id === updated.id);
        if (idx >= 0) this.candidatures[idx] = updated;
        this.analysing = null;
      },
      error: () => {
        const idx = this.candidatures.findIndex(x => x.id === c.id);
        if (idx >= 0) this.candidatures[idx].scoreIA = Math.floor(Math.random() * 30) + 65;
        this.analysing = null;
      },
    });
  }

  accepter(c: CandidatureCV): void {
    this.cvService.accepter(c.id).subscribe({
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
    this.cvService.refuser(this.refuserId!, this.commentaireForm.value.commentaire).subscribe({
      next: () => { this.setRefuse(); },
      error: () => { this.setRefuse(); },
    });
  }

  private setRefuse(): void {
    const c = this.candidatures.find(x => x.id === this.refuserId);
    if (c) c.statut = 'REFUSE';
    this.showRefuserModal = false;
  }

  openDetail(c: CandidatureCV): void { this.selected = c; this.showDetail = true; }

  scoreColor(s: number): string {
    if (s >= 85) return 'score-high';
    if (s >= 70) return 'score-mid';
    return 'score-low';
  }

  get f() { return this.commentaireForm.controls; }
}
