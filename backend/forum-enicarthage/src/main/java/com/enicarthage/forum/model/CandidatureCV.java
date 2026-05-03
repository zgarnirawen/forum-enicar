package com.enicarthage.forum.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "candidatures_cv")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class CandidatureCV extends BaseEntity {
    @Column(name = "fichier_cv") private String fichierCV;
    @Column(name = "poste_vise") private String posteVise;
    @Column(name = "score_ia") private Double scoreIA;
    @Enumerated(EnumType.STRING) private StatutCandidature statut;
    private String commentaire;
    @Column(name = "date_depot") private LocalDateTime dateDepot;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidat_id") private Utilisateur candidat;
}
