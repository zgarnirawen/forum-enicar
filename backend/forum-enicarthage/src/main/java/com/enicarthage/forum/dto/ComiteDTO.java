package com.enicarthage.forum.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ComiteDTO {
    private Long id;
    private String nom;
    private String description;
    private Long forumProjectId;
    private Long chefComiteId;
    private String chefNom;
    private int nombreMembres;
    private int nombreTaches;
    private int avancement;
}
