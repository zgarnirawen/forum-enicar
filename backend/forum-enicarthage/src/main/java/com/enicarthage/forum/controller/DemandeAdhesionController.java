package com.enicarthage.forum.controller;

import com.enicarthage.forum.dto.DemandeAdhesionDTO;
import com.enicarthage.forum.model.NomComite;
import com.enicarthage.forum.model.PosteVise;
import com.enicarthage.forum.model.StatutDemande;
import com.enicarthage.forum.service.DemandeAdhesionService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@RequiredArgsConstructor
public class DemandeAdhesionController {

    private final DemandeAdhesionService demandeService;

    // ─── ENDPOINT PUBLIC — aucune authentification requise ───────────────────
    // (SecurityConfig doit avoir : .requestMatchers("/api/candidatures/soumettre").permitAll())

    @PostMapping(value = "/soumettre", consumes = "multipart/form-data")
    public ResponseEntity<DemandeAdhesionDTO> soumettre(
            @RequestParam("nom")        String nom,
            @RequestParam("email")      String email,
            @RequestParam("telephone")  String telephone,
            @RequestParam(value = "linkedinUrl", required = false) String linkedinUrl,
            @RequestParam("posteVise")  PosteVise posteVise,
            @RequestParam(value = "comiteVise", required = false) NomComite comiteVise,
            @RequestParam("motivation") String motivation,
            @RequestParam(value = "fichierCV", required = false) MultipartFile fichierCV) {

        DemandeAdhesionDTO result = demandeService.soumettre(
                nom, email, telephone, linkedinUrl,
                posteVise, comiteVise, motivation, fichierCV);

        return ResponseEntity.ok(result);
    }

    // ─── ENDPOINTS PROTÉGÉS ───────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE')")
    public List<DemandeAdhesionDTO> getAll() {
        return demandeService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE')")
    public DemandeAdhesionDTO getById(@PathVariable Long id) {
        return demandeService.findById(id);
    }

    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE')")
    public List<DemandeAdhesionDTO> getByStatut(@PathVariable StatutDemande statut) {
        return demandeService.findByStatut(statut);
    }

    @GetMapping("/poste/{poste}")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE')")
    public List<DemandeAdhesionDTO> getByPoste(@PathVariable PosteVise poste) {
        return demandeService.findByPoste(poste);
    }

    @GetMapping("/poste/{poste}/statut/{statut}")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE')")
    public List<DemandeAdhesionDTO> getByPosteAndStatut(
            @PathVariable PosteVise poste,
            @PathVariable StatutDemande statut) {
        return demandeService.findByPosteAndStatut(poste, statut);
    }

    // Utilisé par le Chef de Comité pour voir les candidatures membres de son comité
    @GetMapping("/comite/{comite}/poste/{poste}")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE','CHEF_COMITE')")
    public List<DemandeAdhesionDTO> getByComiteAndPoste(
            @PathVariable NomComite comite,
            @PathVariable PosteVise poste) {
        return demandeService.findByComiteAndPoste(comite, poste);
    }

    @PutMapping("/{id}/accepter")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE','CHEF_COMITE')")
    public DemandeAdhesionDTO accepter(@PathVariable Long id) {
        return demandeService.accepter(id);
    }

    @PutMapping("/{id}/refuser")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE','CHEF_COMITE')")
    public DemandeAdhesionDTO refuser(@PathVariable Long id, @RequestParam String commentaire) {
        return demandeService.refuser(id, commentaire);
    }

    @PostMapping("/{id}/analyser")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE','CHEF_COMITE')")
    public ResponseEntity<DemandeAdhesionDTO> analyserIA(@PathVariable Long id) {
        return ResponseEntity.ok(demandeService.analyserEtRetourner(id));
    }

    @GetMapping("/{id}/cv")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE','COORDINATRICE','CHEF_COMITE')")
    public ResponseEntity<Resource> telechargerCV(@PathVariable Long id) {
        DemandeAdhesionDTO demande = demandeService.findById(id);
        String cheminCV = demande.getCheminCV();
        if (cheminCV == null || cheminCV.isBlank()) {
            return ResponseEntity.notFound().build();
        }
        try {
            Path uploadBase = Paths.get(DemandeAdhesionService.UPLOAD_DIR).toAbsolutePath().normalize();
            Path filePath   = Paths.get(cheminCV).toAbsolutePath().normalize();
            // Protection contre le path traversal
            if (!filePath.startsWith(uploadBase)) {
                return ResponseEntity.badRequest().build();
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            String filename = filePath.getFileName().toString();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}