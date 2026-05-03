package com.enicarthage.forum.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WorkshopDTO {
    private String titre;
    private String description;
    private String intervenant;
    private LocalDateTime dateHeure;
    private Long comiteId;
}
