package com.enicarthage.forum.dto;
import com.enicarthage.forum.model.StatutCandidature;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CandidatureCVDTO {
    private Long id;
    private String fichierCV;
    private String posteVise;
    private Double scoreIA;
    private StatutCandidature statut;
    private String commentaire;
    private LocalDateTime dateDepot;
    private Long candidatId;
    private String candidatNom;
    private String candidatEmail;
}
