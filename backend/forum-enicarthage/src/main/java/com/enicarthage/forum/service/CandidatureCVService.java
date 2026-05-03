package com.enicarthage.forum.service;

import com.enicarthage.forum.exception.ResourceNotFoundException;
import com.enicarthage.forum.model.*;
import com.enicarthage.forum.repository.CandidatureCVRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;

@Service @Transactional @Log4j2 @RequiredArgsConstructor
public class CandidatureCVService {

    private final CandidatureCVRepository candidatureCVRepository;
    private static final String UPLOAD_DIR = "uploads/cv/";

    public CandidatureCV deposer(MultipartFile fichier, String posteVise, Utilisateur candidat) {
        String path = UPLOAD_DIR + System.currentTimeMillis() + "_" + fichier.getOriginalFilename();
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            Files.copy(fichier.getInputStream(), Paths.get(path), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("Erreur sauvegarde fichier : {}", e.getMessage());
        }
        CandidatureCV candidature = CandidatureCV.builder()
                .fichierCV(path)
                .posteVise(posteVise)
                .statut(StatutCandidature.EN_ATTENTE)
                .dateDepot(LocalDateTime.now())
                .candidat(candidat)
                .build();
        CandidatureCV saved = candidatureCVRepository.save(candidature);
        analyserAvecIA(saved);
        return saved;
    }

    public void analyserAvecIA(CandidatureCV candidature) {
        // Point d'extension : appel HTTP vers API Python FastAPI
        // RestTemplate restTemplate = new RestTemplate();
        // Double score = restTemplate.postForObject("http://localhost:8000/score", candidature.getFichierCV(), Double.class);
        double scoreSimule = Math.round(Math.random() * 10000.0) / 100.0;
        candidature.setScoreIA(scoreSimule);
        candidatureCVRepository.save(candidature);
        log.info("Score IA pour {} : {}", candidature.getPosteVise(), scoreSimule);
    }

    public CandidatureCV accepter(Long id) {
        CandidatureCV c = candidatureCVRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidature non trouvee"));
        c.setStatut(StatutCandidature.ACCEPTE);
        return candidatureCVRepository.save(c);
    }

    public CandidatureCV refuser(Long id, String commentaire) {
        CandidatureCV c = candidatureCVRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidature non trouvee"));
        c.setStatut(StatutCandidature.REFUSE);
        c.setCommentaire(commentaire);
        return candidatureCVRepository.save(c);
    }

    public List<CandidatureCV> findAll() { return candidatureCVRepository.findAll(); }

    public CandidatureCV findById(Long id) {
        return candidatureCVRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidature non trouvee"));
    }
}