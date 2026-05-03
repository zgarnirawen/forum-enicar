import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statut' })
export class StatutPipe implements PipeTransform {
  private map: Record<string, string> = {
    // StatutTache
    A_FAIRE: 'À faire', EN_COURS: 'En cours', TERMINEE: 'Terminée', EN_RETARD: 'En retard',
    // PrioriteTache
    URGENTE: 'Urgente', NORMALE: 'Normale',
    // StatutWorkshop
    PROPOSE: 'Proposé', VALIDE: 'Validé', REFUSE: 'Refusé',
    // StatutMembre / StatutCandidature
    EN_ATTENTE: 'En attente', ACCEPTE: 'Accepté',
    // StatutProjet
    PLANIFICATION: 'Planification', CLOTURE: 'Clôturé',
    // Roles
    ADMIN: 'Admin', COMITE_PILOTAGE: 'Comité Pilotage',
    COORDINATRICE: 'Coordinatrice', CHEF_COMITE: 'Chef de Comité', MEMBRE: 'Membre',
    // FIX: TypeNotification (backend enum values)
    TACHE_ASSIGNEE: 'Assignation', TACHE_EN_RETARD: 'Retard',
    WORKSHOP_VALIDE: 'Workshop validé', WORKSHOP_REFUSE: 'Workshop refusé',
    CANDIDATURE_MISE_A_JOUR: 'Candidature mise à jour',
    RAPPEL: 'Rappel', BLOCAGE: 'Blocage',
  };
  transform(value: string): string { return this.map[value] ?? value; }
}
