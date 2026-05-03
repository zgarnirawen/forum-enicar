package com.enicarthage.forum.service;

import com.enicarthage.forum.dto.ComiteDTO;
import com.enicarthage.forum.exception.ResourceNotFoundException;
import com.enicarthage.forum.model.*;
import com.enicarthage.forum.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service @Transactional @Log4j2 @RequiredArgsConstructor
public class ComiteService {

    private final ComiteRepository comiteRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ForumProjectRepository forumProjectRepository;
    private final TacheRepository tacheRepository;
    private final MembreRepository membreRepository;

    public ComiteDTO creer(ComiteDTO dto) {
        Comite comite = new Comite();
        comite.setNom(dto.getNom());
        comite.setDescription(dto.getDescription());
        if (dto.getForumProjectId() != null)
            comite.setForumProject(forumProjectRepository.findById(dto.getForumProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("ForumProject non trouve")));
        if (dto.getChefComiteId() != null)
            comite.setChefComite(utilisateurRepository.findById(dto.getChefComiteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouve")));
        return toDTO(comiteRepository.save(comite));
    }

    @Transactional(readOnly = true)
    public ComiteDTO findById(Long id) {
        return toDTO(findEntity(id));
    }

    @Transactional(readOnly = true)
    public List<ComiteDTO> findAll() {
        return comiteRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComiteDTO> findByForumProject(Long forumProjectId) {
        return comiteRepository.findByForumProjectId(forumProjectId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ComiteDTO update(Long id, ComiteDTO dto) {
        Comite comite = findEntity(id);
        comite.setNom(dto.getNom());
        comite.setDescription(dto.getDescription());
        if (dto.getChefComiteId() != null)
            comite.setChefComite(utilisateurRepository.findById(dto.getChefComiteId()).orElse(null));
        return toDTO(comiteRepository.save(comite));
    }

    @Transactional(readOnly = true)
    public ComiteDTO findByChef(Long chefId) {
        return comiteRepository.findByChefComiteId(chefId)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Comite non trouve pour ce chef"));
    }

    public void supprimer(Long id) { comiteRepository.deleteById(id); }

    private Comite findEntity(Long id) {
        return comiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comite non trouve : " + id));
    }

    private ComiteDTO toDTO(Comite c) {
        long total = tacheRepository.countByComiteId(c.getId());
        long terminees = tacheRepository.countByComiteIdAndStatut(c.getId(), StatutTache.TERMINEE);
        int avancement = total == 0 ? 0 : (int) Math.round((double) terminees / total * 100);
        long nbMembres = membreRepository.findByComiteIdAndStatut(c.getId(), StatutMembre.ACCEPTE).size();
        return ComiteDTO.builder()
                .id(c.getId())
                .nom(c.getNom())
                .description(c.getDescription())
                .forumProjectId(c.getForumProject() != null ? c.getForumProject().getId() : null)
                .chefComiteId(c.getChefComite() != null ? c.getChefComite().getId() : null)
                .chefNom(c.getChefComite() != null ? c.getChefComite().getNom() : null)
                .nombreMembres((int) nbMembres)
                .nombreTaches((int) total)
                .avancement(avancement)
                .build();
    }
}
