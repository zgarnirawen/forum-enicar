package com.enicarthage.forum.dto;
import com.enicarthage.forum.model.TypeNotification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private String message;
    private TypeNotification type;
    private boolean lu;
    private LocalDateTime dateEnvoi;
    private Long destinationId;
    private Long tacheId;
}
