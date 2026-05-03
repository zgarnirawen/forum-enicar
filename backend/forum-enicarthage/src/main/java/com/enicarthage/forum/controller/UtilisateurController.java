package com.enicarthage.forum.controller;

import com.enicarthage.forum.model.*;
import com.enicarthage.forum.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    @GetMapping
    public List<Utilisateur> getAll() { return utilisateurService.findAll(); }

    @GetMapping("/{id}")
    public Utilisateur getById(@PathVariable Long id) { return utilisateurService.findById(id); }

    @PostMapping
    public Utilisateur creer(@RequestBody Utilisateur u) { return utilisateurService.creer(u); }

    @PutMapping("/{id}")
    public Utilisateur modifier(@PathVariable Long id, @RequestBody Utilisateur u) {
        return utilisateurService.modifier(id, u);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        utilisateurService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activer")
    public Utilisateur activer(@PathVariable Long id, @RequestParam boolean actif) {
        return utilisateurService.activerCompte(id, actif);
    }

    @PatchMapping("/{id}/role")
    public Utilisateur assignerRole(@PathVariable Long id, @RequestParam RoleEnum role) {
        return utilisateurService.assignerRole(id, role);
    }
}