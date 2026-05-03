/* src/app/features/admin/forum-project/forum-project.component.ts */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumProjectService } from '../../../core/services/api.services';
import { ForumProject } from '../../../core/models';

@Component({
  selector: 'app-forum-project',
  templateUrl: './forum-project.component.html',
  styleUrls: ['./forum-project.component.scss'],
})
export class ForumProjectComponent implements OnInit {
  projects: ForumProject[] = [];
  loading = false;
  showModal = false;
  editMode = false;
  editId: number | null = null;
  confirmCloture = false;
  clotureId: number | null = null;
  form: FormGroup;

  constructor(private projectService: ForumProjectService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nom:           ['', Validators.required],
      edition:       ['', Validators.required],
      dateDebut:     ['', Validators.required],
      dateEvenement: ['', Validators.required],
      lieu:          ['', Validators.required],
      description:   [''],
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.projectService.getAll().subscribe({
      next: (p) => { this.projects = p; this.loading = false; },
      error: () => {
        this.projects = [
          { id: 1, nom: 'Forum d\'Entreprise ENICarthage 2025', edition: '2025', dateDebut: '2025-01-15', dateEvenement: '2025-04-20', lieu: 'ENICarthage, Ariana', description: 'Édition anniversaire du Forum', statut: 'EN_COURS' },
          { id: 2, nom: 'Forum d\'Entreprise ENICarthage 2024', edition: '2024', dateDebut: '2024-01-10', dateEvenement: '2024-04-15', lieu: 'ENICarthage, Ariana', description: 'Forum avec 60+ entreprises', statut: 'CLOTURE' },
        ];
        this.loading = false;
      },
    });
  }

  openCreate(): void {
    this.editMode = false; this.editId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(p: ForumProject): void {
    this.editMode = true; this.editId = p.id;
    this.form.patchValue(p);
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const obs = this.editMode && this.editId
      ? this.projectService.update(this.editId, this.form.value)
      : this.projectService.create(this.form.value);
    obs.subscribe({ next: () => { this.showModal = false; this.load(); }, error: () => this.load() });
  }

  askCloturer(id: number): void { this.clotureId = id; this.confirmCloture = true; }
  doCloturer(): void {
    this.projectService.cloturer(this.clotureId!).subscribe({
      next: () => { this.confirmCloture = false; this.load(); }
    });
  }

  statutColor(s: string): string {
    return { PLANIFICATION: 'planif', EN_COURS: 'encours', CLOTURE: 'cloture' }[s] ?? '';
  }

  get f() { return this.form.controls; }
}
