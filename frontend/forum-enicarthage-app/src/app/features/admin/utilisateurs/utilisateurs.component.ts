import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../../../core/services/api.services';
import { User, Role, RoleOption } from '../../../core/models';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss'],
})
export class UtilisateursComponent implements OnInit {
  utilisateurs: User[] = [];
  loading = false;
  showModal = false;
  editMode = false;
  editId: number | null = null;
  form: FormGroup;
  search = '';
  filterRole: Role | '' = '';
  confirmDelete = false;
  deleteId: number | null = null;

  roles: RoleOption[] = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'COMITE_PILOTAGE', label: 'Comité Pilotage' },
    { value: 'COORDINATRICE', label: 'Coordinatrice' },
    { value: 'CHEF_COMITE', label: 'Chef de Comité' },
    { value: 'MEMBRE', label: 'Membre' },
  ];

  mockUsers: User[] = [
    { id:1, nom:'Fatma Bouajla',  email:'admin@forum.tn',    role:'ADMIN',           actif:true },
    { id:2, nom:'Mayssa Abdouli', email:'pilotage@forum.tn', role:'COMITE_PILOTAGE', actif:true },
    { id:3, nom:'Sarra Ben Haj',  email:'coord@forum.tn',    role:'COORDINATRICE',   actif:true },
    { id:4, nom:'Rawen Zgarni',   email:'chef@forum.tn',     role:'CHEF_COMITE',     actif:true, comiteId:1 },
    { id:5, nom:'Ali Mansour',    email:'membre@forum.tn',   role:'MEMBRE',          actif:true, comiteId:1 },
  ];

  constructor(private userService: UtilisateurService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nom:        ['', Validators.required],
      email:      ['', [Validators.required, Validators.email]],
      motDePasse: [''],
      role:       ['MEMBRE', Validators.required],
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    // FIX: getAll() now returns User[] directly (not Page<User>)
    this.userService.getAll().subscribe({
      next: u => { this.utilisateurs = u; this.loading = false; },
      error: () => { this.utilisateurs = this.mockUsers; this.loading = false; }
    });
  }

  openCreate(): void {
    this.editMode = false; this.editId = null;
    this.form.reset({ role: 'MEMBRE' }); this.showModal = true;
  }

  openEdit(u: User): void {
    this.editMode = true; this.editId = u.id;
    this.form.patchValue({ nom: u.nom, email: u.email, role: u.role });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const obs = this.editMode && this.editId
      ? this.userService.update(this.editId, this.form.value)
      : this.userService.create(this.form.value);
    obs.subscribe({ next: () => { this.showModal = false; this.load(); }, error: () => this.load() });
  }

  toggleActif(u: User): void {
    this.userService.activer(u.id, !u.actif).subscribe({
      next: updated => { u.actif = updated.actif; },
      error: () => { u.actif = !u.actif; }
    });
  }

  supprimer(id: number): void {
    this.userService.delete(id).subscribe({ next: () => this.load() });
  }

  get filtered(): User[] {
    return this.utilisateurs.filter(u => {
      const matchSearch = !this.search || u.nom.toLowerCase().includes(this.search.toLowerCase()) || u.email.toLowerCase().includes(this.search.toLowerCase());
      const matchRole = !this.filterRole || u.role === this.filterRole;
      return matchSearch && matchRole;
    });
  }

  initials(nom: string): string {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  confirmDeleteUser(id: number): void {
    this.deleteId = id;
    this.confirmDelete = true;
  }

  doDelete(): void {
    if (this.deleteId) {
      this.userService.delete(this.deleteId).subscribe({
        next: () => {
          this.confirmDelete = false;
          this.deleteId = null;
          this.load();
        },
        error: () => {
          this.confirmDelete = false;
          this.deleteId = null;
        }
      });
    }
  }

  get f() { return this.form.controls; }
}
