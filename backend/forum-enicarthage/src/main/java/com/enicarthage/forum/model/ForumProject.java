package com.enicarthage.forum.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import jakarta.validation.constraints.NotNull;
@Entity @Table(name = "forum_projects")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class ForumProject extends BaseEntity {
    @NotNull private String nom;
    private String edition;
    @Column(name = "date_debut")   private LocalDate dateDebut;
    @Column(name = "date_evenement") private LocalDate dateEvenement;
    private String lieu;
    @Column(columnDefinition = "TEXT") private String description;
    @Enumerated(EnumType.STRING) private StatutProjet statut;
    @OneToMany(mappedBy = "forumProject", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comite> comites;
}
