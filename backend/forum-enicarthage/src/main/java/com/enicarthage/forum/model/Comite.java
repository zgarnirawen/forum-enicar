package com.enicarthage.forum.model;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "comites")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class Comite extends BaseEntity {
    private String nom;
    @Column(columnDefinition = "TEXT") private String description;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_project_id") private ForumProject forumProject;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chef_comite_id") private Utilisateur chefComite;
}
