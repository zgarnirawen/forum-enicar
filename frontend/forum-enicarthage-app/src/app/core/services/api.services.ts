import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User, ForumProject, Comite, Tache, Workshop,
  CandidatureCV, Notification, KPIs, AvancementComite, Membre, Page
} from '../models';

const API = environment.apiUrl;

// ─── UTILISATEUR ──────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private url = `${API}/utilisateurs`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<User[]> { return this.http.get<User[]>(this.url); }
  getById(id: number): Observable<User> { return this.http.get<User>(`${this.url}/${id}`); }
  create(u: Partial<User> & { motDePasse?: string }): Observable<User> {
    return this.http.post<User>(this.url, u);
  }
  update(id: number, u: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, u);
  }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  activer(id: number, actif: boolean): Observable<User> {
    return this.http.patch<User>(`${this.url}/${id}/activer`, null, { params: { actif } });
  }
  assignerRole(id: number, role: string): Observable<User> {
    return this.http.patch<User>(`${this.url}/${id}/role`, null, { params: { role } });
  }
}

// ─── FORUM PROJECT ────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ForumProjectService {
  private url = `${API}/forum-projects`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<ForumProject[]> { return this.http.get<ForumProject[]>(this.url); }
  getById(id: number): Observable<ForumProject> { return this.http.get<ForumProject>(`${this.url}/${id}`); }
  getHistorique(): Observable<ForumProject[]> { return this.http.get<ForumProject[]>(`${this.url}/historique`); }
  create(f: Partial<ForumProject>): Observable<ForumProject> {
    return this.http.post<ForumProject>(this.url, f);
  }
  update(id: number, f: Partial<ForumProject>): Observable<ForumProject> {
    return this.http.put<ForumProject>(`${this.url}/${id}`, f);
  }
  archiver(id: number): Observable<ForumProject> {
    return this.http.patch<ForumProject>(`${this.url}/${id}/archiver`, {});
  }
  cloturer(id: number): Observable<ForumProject> {
    return this.http.patch<ForumProject>(`${this.url}/${id}/cloturer`, {});
  }
}

// ─── COMITE ───────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ComiteService {
  private url = `${API}/comites`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Comite[]> { return this.http.get<Comite[]>(this.url); }
  getById(id: number): Observable<Comite> { return this.http.get<Comite>(`${this.url}/${id}`); }
  getByForum(forumId: number): Observable<Comite[]> {
    return this.http.get<Comite[]>(`${this.url}/forum/${forumId}`);
  }
  getMonComite(): Observable<Comite> { return this.http.get<Comite>(`${this.url}/mon-comite`); }
  create(c: Partial<Comite>): Observable<Comite> { return this.http.post<Comite>(this.url, c); }
  update(id: number, c: Partial<Comite>): Observable<Comite> {
    return this.http.put<Comite>(`${this.url}/${id}`, c);
  }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}

// ─── MEMBRE — NEW (join entity with statut) ───────────────────
@Injectable({ providedIn: 'root' })
export class MembreService {
  private url = `${API}/membres`;
  constructor(private http: HttpClient) {}
  getMembresAcceptes(comiteId: number): Observable<Membre[]> {
    return this.http.get<Membre[]>(`${this.url}/comite/${comiteId}`);
  }
  getDemandesEnAttente(comiteId: number): Observable<Membre[]> {
    return this.http.get<Membre[]>(`${this.url}/comite/${comiteId}/en-attente`);
  }
  demanderAdhesion(comiteId: number): Observable<Membre> {
    return this.http.post<Membre>(`${this.url}/rejoindre/${comiteId}`, {});
  }
  accepter(membreId: number): Observable<Membre> {
    return this.http.put<Membre>(`${this.url}/${membreId}/accepter`, {});
  }
  refuser(membreId: number): Observable<Membre> {
    return this.http.put<Membre>(`${this.url}/${membreId}/refuser`, {});
  }
}

// ─── TACHE ────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class TacheService {
  private url = `${API}/taches`;
  constructor(private http: HttpClient) {}
  getAll(filter?: { statut?: string }): Observable<Tache[]> {
    if (filter?.statut) {
      return this.http.get<Tache[]>(this.url, { params: { statut: filter.statut } });
    }
    return this.http.get<Tache[]>(this.url);
  }
  getMesTaches(): Observable<Tache[]> { return this.http.get<Tache[]>(`${this.url}/mes-taches`); }
  getByComite(comiteId: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.url}/comite/${comiteId}`);
  }
  getById(id: number): Observable<Tache> { return this.http.get<Tache>(`${this.url}/${id}`); }
  create(t: Partial<Tache>): Observable<Tache> { return this.http.post<Tache>(this.url, t); }
  update(id: number, t: Partial<Tache>): Observable<Tache> {
    return this.http.put<Tache>(`${this.url}/${id}`, t);
  }
  changerStatut(id: number, statut: string): Observable<Tache> {
    return this.http.patch<Tache>(`${this.url}/${id}/statut`, { statut });
  }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  ajouterCommentaire(id: number, contenu: string): Observable<void> {
    return this.http.post<void>(`${this.url}/${id}/commentaires`, { contenu });
  }
}

// ─── WORKSHOP ─────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class WorkshopService {
  private url = `${API}/workshops`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Workshop[]> { return this.http.get<Workshop[]>(this.url); }
  getById(id: number): Observable<Workshop> { return this.http.get<Workshop>(`${this.url}/${id}`); }
  create(w: Partial<Workshop>): Observable<Workshop> { return this.http.post<Workshop>(this.url, w); }
  update(id: number, w: Partial<Workshop>): Observable<Workshop> {
    return this.http.put<Workshop>(`${this.url}/${id}`, w);
  }
  valider(id: number): Observable<Workshop> {
    return this.http.put<Workshop>(`${this.url}/${id}/valider`, {});
  }
  refuser(id: number, commentaire?: string): Observable<Workshop> {
    const body = commentaire ? { commentaire } : {};
    return this.http.put<Workshop>(`${this.url}/${id}/refuser`, body);
  }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}

// ─── CANDIDATURE CV ───────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class CandidatureCVService {
  private url = `${API}/candidatures`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<CandidatureCV[]> { return this.http.get<CandidatureCV[]>(this.url); }
  getById(id: number): Observable<CandidatureCV> { return this.http.get<CandidatureCV>(`${this.url}/${id}`); }
  upload(formData: FormData): Observable<CandidatureCV> {
    return this.http.post<CandidatureCV>(`${this.url}/upload`, formData);
  }
  accepter(id: number, commentaire?: string): Observable<CandidatureCV> {
    return this.http.put<CandidatureCV>(`${this.url}/${id}/accepter`, {}, { params: commentaire ? { commentaire } : {} });
  }
  refuser(id: number, commentaire: string): Observable<CandidatureCV> {
    return this.http.put<CandidatureCV>(`${this.url}/${id}/refuser`, {}, { params: { commentaire } });
  }
  analyserIA(id: number): Observable<CandidatureCV> {
    return this.http.post<CandidatureCV>(`${this.url}/${id}/analyser`, {});
  }
}

// ─── NOTIFICATION ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private url = `${API}/notifications`;
  constructor(private http: HttpClient) {}
  getMesNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.url}/mes-notifications`);
  }
  getNonLues(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.url}/non-lues`);
  }
  marquerLu(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/lu`, {});
  }
  marquerToutLu(): Observable<void> {
    return this.http.patch<void>(`${this.url}/tout-lu`, {});
  }
}

// ─── STATISTIQUES ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class StatistiquesService {
  private url = `${API}/stats`;
  constructor(private http: HttpClient) {}
  getKPIs(): Observable<KPIs> { return this.http.get<KPIs>(`${this.url}/kpis`); }
  getAvancementComites(): Observable<AvancementComite[]> {
    return this.http.get<AvancementComite[]>(`${this.url}/comites`);
  }
  comparerEditions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/editions`);
  }
}
