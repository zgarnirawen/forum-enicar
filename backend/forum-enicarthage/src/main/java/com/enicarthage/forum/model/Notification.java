package com.enicarthage.forum.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "notifications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class Notification extends BaseEntity {
    @Column(columnDefinition = "TEXT") private String message;
    @Enumerated(EnumType.STRING) private TypeNotification type;
    @Builder.Default private boolean lu = false;
    @Column(name = "date_envoi") private LocalDateTime dateEnvoi;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id") private Utilisateur destination;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tache_id") private Tache tache;
}
