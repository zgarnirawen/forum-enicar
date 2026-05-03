package com.enicarthage.forum.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "configuration_systeme")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(callSuper = true)
public class ConfigurationSysteme extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PhaseRecrutement phaseRecrutementActive = PhaseRecrutement.PHASE_1_COORDINATRICE;

}
