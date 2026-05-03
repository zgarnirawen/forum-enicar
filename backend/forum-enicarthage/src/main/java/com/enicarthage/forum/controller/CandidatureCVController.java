package com.enicarthage.forum.controller;

import com.enicarthage.forum.model.*;
import com.enicarthage.forum.repository.UtilisateurRepository;
import com.enicarthage.forum.service.CandidatureCVService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@RequiredArgsConstructor
public class CandidatureCVController {

    private final CandidatureCVService candidatureCVService;
    private final UtilisateurRepository utilisateurRepository;

    @PostMapping("/upload")
    public CandidatureCV deposer(@RequestParam MultipartFile fichier,
                                  @RequestParam String posteVise,
                                  Authentication auth) {
        Utilisateur candidat = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));
        return candidatureCVService.deposer(fichier, posteVise, candidat);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE')")
    public List<CandidatureCV> getAll() { return candidatureCVService.findAll(); }

    @PutMapping("/{id}/accepter")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE')")
    public CandidatureCV accepter(@PathVariable Long id) {
        return candidatureCVService.accepter(id);
    }

    @PutMapping("/{id}/refuser")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE')")
    public CandidatureCV refuser(@PathVariable Long id, @RequestParam String commentaire) {
        return candidatureCVService.refuser(id, commentaire);
    }
}