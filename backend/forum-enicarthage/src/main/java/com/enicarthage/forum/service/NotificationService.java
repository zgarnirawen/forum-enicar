package com.enicarthage.forum.service;

import com.enicarthage.forum.dto.NotificationDTO;
import com.enicarthage.forum.exception.ResourceNotFoundException;
import com.enicarthage.forum.model.*;
import com.enicarthage.forum.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service @Transactional @Log4j2 @RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Main send method — called by other services
    public void envoyer(String message, Utilisateur destination, TypeNotification type, Tache tache) {
        Notification notif = Notification.builder()
                .message(message)
                .destination(destination)
                .type(type)
                .tache(tache)
                .dateEnvoi(LocalDateTime.now())
                .lu(false)
                .build();
        Notification saved = notificationRepository.save(notif);
        // Push real-time via WebSocket
        try {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(destination.getId()),
                    "/queue/notifications",
                    toDTO(saved));
        } catch (Exception e) {
            log.warn("WebSocket push failed for user {}: {}", destination.getId(), e.getMessage());
        }
        log.debug("Notification envoyee a {} : {}", destination.getEmail(), message);
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsNonLues(Long userId) {
        return notificationRepository.findByDestinationIdAndLuFalse(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getAllByUser(Long userId) {
        return notificationRepository.findByDestinationIdOrderByDateEnvoiDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public NotificationDTO marquerLu(Long id) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvee"));
        notif.setLu(true);
        return toDTO(notificationRepository.save(notif));
    }

    public void marquerToutLu(Long userId) {
        notificationRepository.findByDestinationIdAndLuFalse(userId)
                .forEach(n -> { n.setLu(true); notificationRepository.save(n); });
    }

    private NotificationDTO toDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType())
                .lu(n.isLu())
                .dateEnvoi(n.getDateEnvoi())
                .destinationId(n.getDestination() != null ? n.getDestination().getId() : null)
                .tacheId(n.getTache() != null ? n.getTache().getId() : null)
                .build();
    }
}
