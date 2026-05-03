package com.enicarthage.forum.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity @Table(name = "commentaires")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class Commentaire extends BaseEntity {
    @NotBlank @Column(columnDefinition = "TEXT") private String contenu;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tache_id") private Tache tache;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auteur_id") private Utilisateur auteur;
}
