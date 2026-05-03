package com.enicarthage.forum.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "workshops")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class Workshop extends BaseEntity {
    @NotBlank private String titre;
    @Column(columnDefinition = "TEXT") private String description;
    private String intervenant;
    @Column(name = "date_heure") private LocalDateTime dateHeure;
    @Enumerated(EnumType.STRING) private StatutWorkshop statut;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comite_id") private Comite comite;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propose_par_id") private Utilisateur proposePar;
}
