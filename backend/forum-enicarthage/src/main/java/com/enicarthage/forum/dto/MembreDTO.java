package com.enicarthage.forum.dto;
import com.enicarthage.forum.model.StatutMembre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MembreDTO {
    private Long id;
    private Long utilisateurId;
    private String utilisateurNom;
    private String utilisateurEmail;
    private Long comiteId;
    private String comiteNom;
    private StatutMembre statut;
    private LocalDateTime dateAdhesion;
}
