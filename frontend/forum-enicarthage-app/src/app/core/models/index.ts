// ─── ENUMS ────────────────────────────────────────────────────
export type Role = 'ADMIN' | 'COMITE_PILOTAGE' | 'COORDINATRICE' | 'CHEF_COMITE' | 'MEMBRE';
export interface RoleOption { value: Role; label: string; }
export type StatutProjet = 'PLANIFICATION' | 'EN_COURS' | 'CLOTURE';
export type StatutTache = 'A_FAIRE' | 'EN_COURS' | 'TERMINEE' | 'EN_RETARD';
export type Priorite = 'NORMALE' | 'URGENTE';
export type StatutWorkshop = 'PROPOSE' | 'VALIDE' | 'REFUSE';
export type StatutCV = 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';
export type StatutMembre = 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';

// FIX: Synced with backend TypeNotification enum
export type TypeNotification =
  | 'TACHE_ASSIGNEE'
  | 'TACHE_EN_RETARD'
  | 'WORKSHOP_VALIDE'
  | 'WORKSHOP_REFUSE'
  | 'CANDIDATURE_MISE_A_JOUR'
  | 'RAPPEL'
  | 'BLOCAGE';

// ─── AUTH — FIX: matches backend JwtResponse { token, user: User } ──────
export interface LoginRequest { email: string; motDePasse: string; }
export interface RegisterRequest { nom: string; email: string; motDePasse: string; role: Role; }
export interface AuthResponse { token: string; user: User; }

// ─── USER ─────────────────────────────────────────────────────
export interface User {
  id: number; nom: string; email: string;
  role: Role; actif: boolean;
  comiteId?: number;   // FIX: from JWT claim, needed by route guards
}

// ─── FORUM PROJECT ────────────────────────────────────────────
export interface ForumProject {
  id: number; nom: string; edition: string;
  dateDebut: string; dateEvenement: string;
  lieu: string; description: string;
  statut: StatutProjet;
  comites?: Comite[];
}

// ─── COMITE ───────────────────────────────────────────────────
export interface Comite {
  id: number; nom: string; description: string;
  forumProjectId?: number;
  chefComiteId?: number; chefNom?: string;
  nombreMembres?: number;
  nombreTaches?: number; avancement?: number;
}

// ─── MEMBRE (join entity with statut) — NEW ───────────────────
export interface Membre {
  id: number;
  utilisateurId: number; nom: string; email: string;
  comiteId: number; comiteNom: string;
  statut: StatutMembre;
  dateAdhesion?: string;
}

// ─── TACHE ────────────────────────────────────────────────────
export interface Tache {
  id: number; titre: string; description: string;
  dateDebut: string; dateFin: string;
  priorite: Priorite; statut: StatutTache;
  comiteId?: number; comiteNom?: string;
  membreId?: number; membreNom?: string;
  commentaires?: Commentaire[];
}

// ─── WORKSHOP ─────────────────────────────────────────────────
export interface Workshop {
  id: number; titre: string; description: string;
  intervenant: string; dateHeure: string;
  statut: StatutWorkshop;
  comiteId: number; comiteNom?: string;
  proposeParId?: number; proposeParNom?: string;
}

// ─── CANDIDATURE CV ───────────────────────────────────────────
export interface CandidatureCV {
  id: number; fichierCV: string; posteVise: string;
  scoreIA: number; statut: StatutCV;
  commentaire?: string; dateDepot: string;
  candidatId: number; candidatNom: string; candidatEmail?: string;
}

// ─── NOTIFICATION ─────────────────────────────────────────────
export interface Notification {
  id: number; message: string; lu: boolean;
  dateEnvoi: string; type: TypeNotification;
  destinationId?: number; tacheId?: number;
}

// ─── COMMENTAIRE ──────────────────────────────────────────────
export interface Commentaire {
  id: number; contenu: string; dateCreation?: string;
  auteurId: number; auteurNom: string;
}

// ─── STATS ────────────────────────────────────────────────────
export interface KPIs {
  totalUtilisateurs: number;
  totalTaches: number;
  tachesTerminees: number;
  tachesEnRetard: number;
  totalWorkshops: number;
  workshopsValides: number;
  totalCandidatures: number;
  avancementGlobal: number;
  totalComites?: number;
}

export interface AvancementComite {
  comiteId?: number; comiteNom: string;
  total: number; terminees: number; avancement: number;
}

// ─── PAGE RESPONSE ────────────────────────────────────────────
export interface Page<T> {
  content: T[]; totalElements: number;
  totalPages: number; number: number; size: number;
}
