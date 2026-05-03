package com.enicarthage.forum.controller;

import com.enicarthage.forum.dto.MembreDTO;
import com.enicarthage.forum.service.MembreService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/membres")
@RequiredArgsConstructor
public class MembreController {
    private final MembreService membreService;

    @PostMapping("/rejoindre/{comiteId}")
    @PreAuthorize("hasRole('MEMBRE')")
    public MembreDTO demanderAdhesion(@PathVariable Long comiteId,
            org.springframework.security.core.Authentication auth) {
        Long userId = ((com.enicarthage.forum.security.UserDetailsServiceImpl.UserPrincipal) auth.getPrincipal()).getId();
        return membreService.demanderAdhesion(userId, comiteId);
    }

    @PutMapping("/{id}/accepter")
    @PreAuthorize("hasAnyRole('CHEF_COMITE','ADMIN','COORDINATRICE')")
    public MembreDTO accepter(@PathVariable Long id) { return membreService.accepter(id); }

    @PutMapping("/{id}/refuser")
    @PreAuthorize("hasAnyRole('CHEF_COMITE','ADMIN','COORDINATRICE')")
    public MembreDTO refuser(@PathVariable Long id) { return membreService.refuser(id); }

    @GetMapping("/comite/{comiteId}/en-attente")
    @PreAuthorize("hasAnyRole('CHEF_COMITE','ADMIN','COORDINATRICE')")
    public List<MembreDTO> getDemandesEnAttente(@PathVariable Long comiteId) {
        return membreService.getDemandesEnAttente(comiteId);
    }

    @GetMapping("/comite/{comiteId}")
    @PreAuthorize("isAuthenticated()")
    public List<MembreDTO> getMembresAcceptes(@PathVariable Long comiteId) {
        return membreService.getMembresAcceptes(comiteId);
    }
}
