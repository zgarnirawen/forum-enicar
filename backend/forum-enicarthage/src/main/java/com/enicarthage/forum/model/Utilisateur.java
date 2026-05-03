package com.enicarthage.forum.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity @Table(name = "utilisateurs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class Utilisateur extends BaseEntity {
    @NotBlank @Column(length = 100)
    private String nom;
    @Email @Column(unique = true, nullable = false)
    private String email;
    @Column(name = "mot_de_passe")
    private String motDePasse;
    @Builder.Default private boolean actif = true;
    @Enumerated(EnumType.STRING)
    private RoleEnum role;
    @Column(name = "comite_id")
    private Long comiteId;
}
