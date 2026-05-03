package com.enicarthage.forum.dto;

import com.enicarthage.forum.model.NomComite;
import com.enicarthage.forum.model.PosteVise;
import com.enicarthage.forum.model.StatutDemande;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DemandeAdhesionDTO {
    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private String linkedinUrl;
    private PosteVise posteVise;
    private NomComite comiteVise;
    private String motivation;
    private String cheminCV;
    private Double scoreIA;
    private String justificationIA;
    private StatutDemande statut;
    private String commentaireRefus;
    private LocalDateTime dateDepot;
    private LocalDateTime dateDecision;
    private Long utilisateurIdCree;
}