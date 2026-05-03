/* src/app/features/coordinatrice/workshops/coord-workshops.component.ts */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkshopService, ComiteService } from '../../../core/services/api.services';
import { Workshop, Comite } from '../../../core/models';

@Component({
  selector: 'app-coord-workshops',
  templateUrl: './coord-workshops.component.html',
  styleUrls: ['./coord-workshops.component.scss'],
})
export class CoordWorkshopsComponent implements OnInit {
  workshops: Workshop[] = [];
  comites: Comite[] = [];
  loading = false;
  filter = 'TOUS';
  showModal = false;
  editMode = false;
  editId: number | null = null;
  showRefuserModal = false;
  refuserId: number | null = null;
  refuserForm: FormGroup;
  form: FormGroup;

  filters = ['TOUS', 'PROPOSE', 'VALIDE', 'REFUSE'];

  mockData: Workshop[] = [
    { id:1, titre:'IA & Métiers du Futur',        description:'Conférence sur l\'IA en entreprise',         intervenant:'Dr. Ahmed Haddad',    dateHeure:'2025-04-20T09:00', statut:'PROPOSE', comiteId:4, comiteNom:'Programme'  },
    { id:2, titre:'Développement Web Moderne',     description:'Workshop Angular / React / Vue',              intervenant:'Sonia Rezgui',        dateHeure:'2025-04-20T11:00', statut:'VALIDE',  comiteId:4, comiteNom:'Programme'  },
    { id:3, titre:'Leadership & Management',       description:'Session développement personnel',             intervenant:'Coach Karim Belhaj',  dateHeure:'2025-04-20T14:00', statut:'VALIDE',  comiteId:4, comiteNom:'Programme'  },
    { id:4, titre:'Entrepreneuriat & Startups',    description:'Retours d\'expérience de fondateurs',        intervenant:'Lina Mrad',           dateHeure:'2025-04-20T16:00', statut:'REFUSE',  comiteId:4, comiteNom:'Programme'  },
    { id:5, titre:'Cybersécurité en Entreprise',   description:'Les enjeux de la sécurité informatique',     intervenant:'CERT Tunisie',        dateHeure:'2025-04-21T09:00', statut:'PROPOSE', comiteId:4, comiteNom:'Programme'  },
  ];

  constructor(
    private workshopService: WorkshopService,
    private comiteService: ComiteService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      titre:       ['', Validators.required],
      description: ['', Validators.required],
      intervenant: ['', Validators.required],
      dateHeure:   ['', Validators.required],
      comiteId:    [null, Validators.required],
    });
    this.refuserForm = this.fb.group({ commentaire: ['', Validators.required] });
  }

  ngOnInit(): void { this.load(); this.loadComites(); }

  load(): void {
    this.loading = true;
    this.workshopService.getAll().subscribe({
      next: w => { this.workshops = w; this.loading = false; },
      error: () => { this.workshops = this.mockData; this.loading = false; },
    });
  }

  loadComites(): void {
    this.comiteService.getAll().subscribe({ next: c => this.comites = c, error: () => {} });
  }

  get filtered(): Workshop[] {
    return this.filter === 'TOUS' ? this.workshops : this.workshops.filter(w => w.statut === this.filter);
  }

  openCreate(): void {
    this.editMode = false; this.editId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(w: Workshop): void {
    this.editMode = true; this.editId = w.id;
    this.form.patchValue(w);
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const obs = this.editMode && this.editId
      ? this.workshopService.update(this.editId, this.form.value)
      : this.workshopService.create(this.form.value);
    obs.subscribe({ next: () => { this.showModal = false; this.load(); }, error: () => this.load() });
  }

  valider(id: number): void {
    this.workshopService.valider(id).subscribe({
      next: () => { const w = this.workshops.find(x => x.id === id); if (w) w.statut = 'VALIDE'; },
      error: () => { const w = this.workshops.find(x => x.id === id); if (w) w.statut = 'VALIDE'; },
    });
  }

  openRefuser(id: number): void { this.refuserId = id; this.refuserForm.reset(); this.showRefuserModal = true; }

  doRefuser(): void {
    if (this.refuserForm.invalid) return;
    this.workshopService.refuser(this.refuserId!, this.refuserForm.value.commentaire).subscribe({
      next: () => { const w = this.workshops.find(x => x.id === this.refuserId); if (w) w.statut = 'REFUSE'; this.showRefuserModal = false; },
      error: () => { const w = this.workshops.find(x => x.id === this.refuserId); if (w) w.statut = 'REFUSE'; this.showRefuserModal = false; },
    });
  }

  get f() { return this.form.controls; }
  get rf() { return this.refuserForm.controls; }

  statutCount(s: string): number {
    return s === 'TOUS' ? this.workshops.length : this.workshops.filter(w => w.statut === s).length;
  }

  statutIcon(s: string): string {
    return { PROPOSE: '🟡', VALIDE: '🟢', REFUSE: '🔴' }[s] ?? '';
  }
}
