import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/api.services';
import { Notification } from '../../../core/models';

@Component({
  selector: 'app-membre-notifications',
  templateUrl: './membre-notifications.component.html',
  styleUrls: ['./membre-notifications.component.scss'],
})
export class MembreNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;

  // FIX: mock uses corrected TypeNotification values from backend enum
  mockNotifications: Notification[] = [
    { id:1, message:'Nouvelle tâche assignée : Bannières réseaux sociaux',  lu:false, dateEnvoi:'2025-03-15T09:30:00', type:'TACHE_ASSIGNEE' },
    { id:2, message:'La tâche Vidéo teaser 60s est en retard !',            lu:false, dateEnvoi:'2025-04-01T08:00:00', type:'TACHE_EN_RETARD' },
    { id:3, message:'Workshop Spring Boot validé — inscription ouverte',    lu:true,  dateEnvoi:'2025-03-20T14:00:00', type:'WORKSHOP_VALIDE' },
    { id:4, message:'Rappel : Date limite Kit PDF dans 3 jours',            lu:true,  dateEnvoi:'2025-03-29T10:00:00', type:'RAPPEL' },
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loading = true;
    this.notificationService.getMesNotifications().subscribe({
      next: n => { this.notifications = n; this.loading = false; },
      error: () => { this.notifications = this.mockNotifications; this.loading = false; }
    });
  }

  marquerLu(notif: Notification): void {
    this.notificationService.marquerLu(notif.id).subscribe({
      next: () => {
        const n = this.notifications.find(n => n.id === notif.id);
        if (n) n.lu = true;
      },
      error: () => {
        const n = this.notifications.find(n => n.id === notif.id);
        if (n) n.lu = true;
      }
    });
  }

  marquerToutLu(): void {
    this.notificationService.marquerToutLu().subscribe({
      next: () => this.notifications.forEach(n => n.lu = true),
      error: () => this.notifications.forEach(n => n.lu = true)
    });
  }

  get nonLues(): number { return this.notifications.filter(n => !n.lu).length; }

  get unreadCount(): number { return this.nonLues; }

  // FIX: label map uses correct backend enum values
  typeLabel(type: string): string {
    const map: Record<string, string> = {
      TACHE_ASSIGNEE: '📋 Assignation',
      TACHE_EN_RETARD: '⏰ Retard',
      WORKSHOP_VALIDE: '✅ Workshop validé',
      WORKSHOP_REFUSE: '❌ Workshop refusé',
      CANDIDATURE_MISE_A_JOUR: '📄 Candidature',
      RAPPEL: '🔔 Rappel',
      BLOCAGE: '🚫 Blocage',
    };
    return map[type] ?? type;
  }

  typeIcon(type: string): string {
    const map: Record<string, string> = {
      TACHE_ASSIGNEE: '📋',
      TACHE_EN_RETARD: '⏰',
      WORKSHOP_VALIDE: '✅',
      WORKSHOP_REFUSE: '❌',
      CANDIDATURE_MISE_A_JOUR: '📄',
      RAPPEL: '🔔',
      BLOCAGE: '🚫',
    };
    return map[type] ?? '📌';
  }

  typeBg(type: string): Record<string, boolean> {
    const bgMap: Record<string, string> = {
      TACHE_ASSIGNEE: 'bg-blue',
      TACHE_EN_RETARD: 'bg-red',
      WORKSHOP_VALIDE: 'bg-green',
      WORKSHOP_REFUSE: 'bg-gray',
      CANDIDATURE_MISE_A_JOUR: 'bg-purple',
      RAPPEL: 'bg-yellow',
      BLOCAGE: 'bg-red',
    };
    const bg = bgMap[type] ?? 'bg-gray';
    return { [bg]: true };
  }
}
