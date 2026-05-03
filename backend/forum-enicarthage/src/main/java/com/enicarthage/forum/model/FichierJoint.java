package com.enicarthage.forum.model;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "fichiers_joints")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class FichierJoint extends BaseEntity {
    private String chemin;
    @Column(name = "type_mime") private String type;
    private Long taille;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tache_id") private Tache tache;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "depose_par_id") private Utilisateur deposePar;
}
