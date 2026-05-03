package com.enicarthage.forum.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "audit_logs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class AuditLog extends BaseEntity {
    private String action;
    @Column(columnDefinition = "TEXT") private String details;
    @Column(name = "date_action") private LocalDateTime dateAction;
    private String utilisateur;
}
