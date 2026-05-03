package com.enicarthage.forum.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "demandes_adhesion")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class DemandeAdhesion extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, unique = false)
    private String email;

    @Column(length = 20)
    private String telephone;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "poste_vise", nullable = false)
    private PosteVise posteVise;

    // Null si posteVise == COORDINATRICE
    @Enumerated(EnumType.STRING)
    @Column(name = "comite_vise")
    private NomComite comiteVise;

    @Column(columnDefinition = "TEXT")
    private String motivation;

    @Column(name = "chemin_cv")
    private String cheminCV;

    @Column(name = "score_ia")
    private Double scoreIA;

    @Column(name = "justification_ia", columnDefinition = "TEXT")
    private String justificationIA;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutDemande statut = StatutDemande.EN_ATTENTE;

    @Column(name = "commentaire_refus", columnDefinition = "TEXT")
    private String commentaireRefus;

    @Column(name = "date_depot")
    private LocalDateTime dateDepot;

    @Column(name = "date_decision")
    private LocalDateTime dateDecision;

    // Rempli uniquement après acceptation — référence vers le compte créé
    @Column(name = "utilisateur_id_cree")
    private Long utilisateurIdCree;
}