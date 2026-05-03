package com.enicarthage.forum.controller;

import com.enicarthage.forum.dto.TacheDTO;
import com.enicarthage.forum.model.*;
import com.enicarthage.forum.service.TacheService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/taches")
@RequiredArgsConstructor
public class TacheController {
    private final TacheService tacheService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATRICE','COMITE_PILOTAGE')")
    public List<Tache> getAll() { return tacheService.findAll(); }

    @GetMapping("/comite/{comiteId}")
    @PreAuthorize("isAuthenticated()")
    public List<Tache> getByComite(@PathVariable Long comiteId) {
        return tacheService.findByComite(comiteId);
    }

    @GetMapping("/mes-taches")
    @PreAuthorize("hasAnyRole('MEMBRE','CHEF_COMITE')")
    public List<Tache> getMesTaches(Authentication auth) {
        Long userId = ((com.enicarthage.forum.security.UserDetailsServiceImpl.UserPrincipal) auth.getPrincipal()).getId();
        return tacheService.findByMembre(userId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Tache getById(@PathVariable Long id) { return tacheService.findById(id); }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','CHEF_COMITE','COORDINATRICE')")
    public Tache creer(@RequestBody TacheDTO dto) { return tacheService.creer(dto); }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("isAuthenticated()")
    public Tache changerStatut(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        StatutTache statut = StatutTache.valueOf(body.get("statut"));
        return tacheService.changerStatut(id, statut);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CHEF_COMITE')")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        tacheService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
