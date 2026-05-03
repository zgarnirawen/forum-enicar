package com.enicarthage.forum.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "membres",
    uniqueConstraints = @UniqueConstraint(columnNames = {"utilisateur_id","comite_id"}))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class Membre extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comite_id", nullable = false)
    private Comite comite;
    @Enumerated(EnumType.STRING)
    @Builder.Default private StatutMembre statut = StatutMembre.EN_ATTENTE;
    @Column(name = "date_adhesion") private LocalDateTime dateAdhesion;
}
