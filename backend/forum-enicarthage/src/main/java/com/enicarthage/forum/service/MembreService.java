package com.enicarthage.forum.service;

import com.enicarthage.forum.dto.MembreDTO;
import com.enicarthage.forum.exception.ResourceNotFoundException;
import com.enicarthage.forum.model.*;
import com.enicarthage.forum.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service @Transactional @Log4j2 @RequiredArgsConstructor
public class MembreService {

    private final MembreRepository membreRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ComiteRepository comiteRepository;

    public MembreDTO demanderAdhesion(Long utilisateurId, Long comiteId) {
        if (membreRepository.existsByUtilisateurIdAndComiteId(utilisateurId, comiteId))
            throw new IllegalStateException("Demande deja existante pour ce comite");
        Utilisateur u = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouve"));
        Comite c = comiteRepository.findById(comiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Comite non trouve"));
        Membre m = Membre.builder().utilisateur(u).comite(c).statut(StatutMembre.EN_ATTENTE).build();
        return toDTO(membreRepository.save(m));
    }

    public MembreDTO accepter(Long membreId) {
        Membre m = findMembre(membreId);
        m.setStatut(StatutMembre.ACCEPTE);
        m.setDateAdhesion(LocalDateTime.now());
        // link user to comite for JWT comiteId claim
        m.getUtilisateur().setComiteId(m.getComite().getId());
        utilisateurRepository.save(m.getUtilisateur());
        log.info("Membre {} accepte dans comite {}", m.getUtilisateur().getEmail(), m.getComite().getNom());
        return toDTO(membreRepository.save(m));
    }

    public MembreDTO refuser(Long membreId) {
        Membre m = findMembre(membreId);
        m.setStatut(StatutMembre.REFUSE);
        log.info("Membre {} refuse dans comite {}", m.getUtilisateur().getEmail(), m.getComite().getNom());
        return toDTO(membreRepository.save(m));
    }

    @Transactional(readOnly = true)
    public List<MembreDTO> getDemandesEnAttente(Long comiteId) {
        return membreRepository.findByComiteIdAndStatut(comiteId, StatutMembre.EN_ATTENTE)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MembreDTO> getMembresAcceptes(Long comiteId) {
        return membreRepository.findByComiteIdAndStatut(comiteId, StatutMembre.ACCEPTE)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MembreDTO> getMesComites(Long utilisateurId) {
        return membreRepository.findByUtilisateurId(utilisateurId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private Membre findMembre(Long id) {
        return membreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande d adhesion non trouvee : " + id));
    }

    private MembreDTO toDTO(Membre m) {
        return MembreDTO.builder()
                .id(m.getId())
                .utilisateurId(m.getUtilisateur().getId())
                .utilisateurNom(m.getUtilisateur().getNom())
                .utilisateurEmail(m.getUtilisateur().getEmail())
                .comiteId(m.getComite().getId())
                .comiteNom(m.getComite().getNom())
                .statut(m.getStatut())
                .dateAdhesion(m.getDateAdhesion())
                .build();
    }
}
