package com.enicarthage.forum.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "taches")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class Tache extends BaseEntity {
    @NotBlank @Column(length = 200) private String titre;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(name = "date_debut") private LocalDate dateDebut;
    @NotNull @Column(name = "date_fin") private LocalDate dateFin;
    @Enumerated(EnumType.STRING) private PrioriteTache priorite;
    @Enumerated(EnumType.STRING) private StatutTache statut;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comite_id") private Comite comite;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membre_id") private Utilisateur membre;
}
