package com.enicarthage.forum.service;

import com.enicarthage.forum.dto.TacheDTO;
import com.enicarthage.forum.exception.ResourceNotFoundException;
import com.enicarthage.forum.model.*;
import com.enicarthage.forum.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service @Transactional @Log4j2 @RequiredArgsConstructor
public class TacheService {

    private final TacheRepository tacheRepository;
    private final ComiteRepository comiteRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationService notificationService;

    public Tache creer(TacheDTO dto) {
        Comite comite = comiteRepository.findById(dto.getComiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Comite non trouve"));
        Tache tache = Tache.builder()
                .titre(dto.getTitre())
                .description(dto.getDescription())
                .dateDebut(dto.getDateDebut())
                .dateFin(dto.getDateFin())
                .priorite(dto.getPriorite())
                .statut(StatutTache.A_FAIRE)
                .comite(comite)
                .build();
        if (dto.getMembreId() != null) {
            Utilisateur membre = utilisateurRepository.findById(dto.getMembreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Membre non trouve"));
            tache.setMembre(membre);
        }
        Tache saved = tacheRepository.save(tache);
        if (saved.getMembre() != null)
            notificationService.envoyer("Nouvelle tache assignee : " + saved.getTitre(),
                    saved.getMembre(), TypeNotification.TACHE_ASSIGNEE, saved);
        return saved;
    }

    public Tache changerStatut(Long id, StatutTache statut) {
        // EN_RETARD is set only by scheduler — block manual set
        if (statut == StatutTache.EN_RETARD)
            throw new IllegalArgumentException("Le statut EN_RETARD est gere automatiquement");
        Tache tache = findEntity(id);
        tache.setStatut(statut);
        return tacheRepository.save(tache);
    }

    public List<Tache> detecterRetards() {
        List<Tache> retards = tacheRepository
                .findByDateFinBeforeAndStatutNot(LocalDate.now(), StatutTache.TERMINEE);
        retards.forEach(t -> {
            if (t.getStatut() != StatutTache.EN_RETARD) {
                t.setStatut(StatutTache.EN_RETARD);
                tacheRepository.save(t);
                if (t.getMembre() != null)
                    notificationService.envoyer("Tache '" + t.getTitre() + "' est en retard !",
                            t.getMembre(), TypeNotification.TACHE_EN_RETARD, t);
            }
        });
        log.info("{} tache(s) en retard detectee(s)", retards.size());
        return retards;
    }

    @Transactional(readOnly = true)
    public List<Tache> findAll() { return tacheRepository.findAll(); }

    @Transactional(readOnly = true)
    public List<Tache> findByComite(Long comiteId) { return tacheRepository.findByComiteId(comiteId); }

    @Transactional(readOnly = true)
    public List<Tache> findByMembre(Long membreId) { return tacheRepository.findByMembreId(membreId); }

    @Transactional(readOnly = true)
    public Tache findById(Long id) { return findEntity(id); }

    public void supprimer(Long id) { tacheRepository.deleteById(id); }

    private Tache findEntity(Long id) {
        return tacheRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tache non trouvee : " + id));
    }
}
