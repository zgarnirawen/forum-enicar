import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComiteService, UtilisateurService } from '../../../core/services/api.services';
import { Comite, User } from '../../../core/models';

@Component({
  selector: 'app-comites',
  templateUrl: './comites.component.html',
  styleUrls: ['./comites.component.scss'],
})
export class ComitesComponent implements OnInit {
  comites: Comite[] = [];
  users: User[] = [];
  loading = false;
  showModal = false;
  editMode = false;
  editId: number | null = null;
  confirmDelete = false;
  deleteId: number | null = null;
  form: FormGroup;

  nomsComites = ['SPONSORING','DESIGN','LOGISTIQUE','PROJET','PROGRAMME','MEDIA'];

  constructor(
    private comiteService: ComiteService,
    private userService: UtilisateurService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nom:          ['', Validators.required],
      description:  ['', Validators.required],
      // FIX: chefComiteId matches backend DTO field name
      chefComiteId: [null],
    });
  }

  ngOnInit(): void { this.load(); this.loadUsers(); }

  load(): void {
    this.loading = true;
    this.comiteService.getAll().subscribe({
      next: (c) => { this.comites = c; this.loading = false; },
      error: () => {
        this.comites = [
          { id:1, nom:'DESIGN',      description:'Identité visuelle et communication', chefNom:'Rawen Zgarni',  avancement:92, nombreTaches:38 },
          { id:2, nom:'SPONSORING',  description:'Relations entreprises partenaires',  chefNom:'Ahmed Ben Ali', avancement:78, nombreTaches:32 },
          { id:3, nom:'LOGISTIQUE',  description:'Organisation matérielle du forum',   chefNom:'Sara Trabelsi', avancement:65, nombreTaches:40 },
          { id:4, nom:'PROGRAMME',   description:'Planning des sessions et speakers',  chefNom:'Youssef Hamdi',avancement:80, nombreTaches:30 },
          { id:5, nom:'MEDIA',       description:'Couverture photo, vidéo, réseaux',  chefNom:'Lina Mrad',    avancement:55, nombreTaches:35 },
          { id:6, nom:'PROJET',      description:'Coordination générale du projet',    chefNom:'Sarra Ben Haj',avancement:38, nombreTaches:25 },
        ];
        this.loading = false;
      },
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (users) => this.users = users.filter(u => u.role === 'CHEF_COMITE'),
      error: () => {}
    });
  }

  openCreate(): void {
    this.editMode = false; this.editId = null;
    this.form.reset(); this.showModal = true;
  }

  openEdit(c: Comite): void {
    this.editMode = true; this.editId = c.id;
    // FIX: patch with chefComiteId (not chefId)
    this.form.patchValue({ nom: c.nom, description: c.description, chefComiteId: c.chefComiteId });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const obs = this.editMode && this.editId
      ? this.comiteService.update(this.editId, this.form.value)
      : this.comiteService.create(this.form.value);
    obs.subscribe({ next: () => { this.showModal = false; this.load(); }, error: () => this.load() });
  }

  confirmDel(id: number): void { this.deleteId = id; this.confirmDelete = true; }
  doDelete(): void {
    this.comiteService.delete(this.deleteId!).subscribe({
      next: () => { this.confirmDelete = false; this.load(); }
    });
  }

  colorByNom(nom: string): string {
    const map: Record<string, string> = {
      DESIGN:'#DBEAFE', SPONSORING:'#D1FAE5', LOGISTIQUE:'#FEF3C7',
      PROGRAMME:'#EDE9FE', MEDIA:'#FCE7F3', PROJET:'#FEE2E2',
    };
    return map[nom] ?? '#F1F5F9';
  }

  iconByNom(nom: string): string {
    const map: Record<string, string> = {
      DESIGN:'🎨', SPONSORING:'🤝', LOGISTIQUE:'🏗',
      PROGRAMME:'📅', MEDIA:'📸', PROJET:'⚙',
    };
    return map[nom] ?? '📋';
  }

  get f() { return this.form.controls; }
}
