package com.enicarthage.forum.controller;

import com.enicarthage.forum.dto.NotificationDTO;
import com.enicarthage.forum.security.UserDetailsServiceImpl;
import com.enicarthage.forum.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    private Long getUserId(Authentication auth) {
        return ((UserDetailsServiceImpl.UserPrincipal) auth.getPrincipal()).getId();
    }

    @GetMapping("/mes-notifications")
    public List<NotificationDTO> getMesNotifications(Authentication auth) {
        return notificationService.getAllByUser(getUserId(auth));
    }

    @GetMapping("/non-lues")
    public List<NotificationDTO> getNonLues(Authentication auth) {
        return notificationService.getNotificationsNonLues(getUserId(auth));
    }

    @PatchMapping("/{id}/lu")
    public NotificationDTO marquerLu(@PathVariable Long id) {
        return notificationService.marquerLu(id);
    }

    @PatchMapping("/tout-lu")
    public void marquerToutLu(Authentication auth) {
        notificationService.marquerToutLu(getUserId(auth));
    }
}
