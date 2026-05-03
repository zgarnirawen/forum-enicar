package com.enicarthage.forum.controller;

import com.enicarthage.forum.dto.ComiteDTO;
import com.enicarthage.forum.service.ComiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comites")
@RequiredArgsConstructor
public class ComiteController {
    private final ComiteService comiteService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<ComiteDTO> getAll() { return comiteService.findAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ComiteDTO getById(@PathVariable Long id) { return comiteService.findById(id); }

    @GetMapping("/forum/{forumId}")
    @PreAuthorize("isAuthenticated()")
    public List<ComiteDTO> getByForum(@PathVariable Long forumId) {
        return comiteService.findByForumProject(forumId);
    }

    @GetMapping("/mon-comite")
    @PreAuthorize("hasRole('CHEF_COMITE')")
    public ComiteDTO getMonComite(org.springframework.security.core.Authentication auth) {
        Long chefId = ((com.enicarthage.forum.security.UserDetailsServiceImpl.UserPrincipal) auth.getPrincipal()).getId();
        return comiteService.findByChef(chefId);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATRICE')")
    public ComiteDTO creer(@RequestBody ComiteDTO dto) { return comiteService.creer(dto); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATRICE')")
    public ComiteDTO update(@PathVariable Long id, @RequestBody ComiteDTO dto) {
        return comiteService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        comiteService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
