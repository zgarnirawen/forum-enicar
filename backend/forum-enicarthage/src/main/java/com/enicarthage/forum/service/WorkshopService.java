package com.enicarthage.forum.service;

import com.enicarthage.forum.exception.ResourceNotFoundException;
import com.enicarthage.forum.model.*;
import com.enicarthage.forum.repository.WorkshopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @Transactional @Log4j2 @RequiredArgsConstructor
public class WorkshopService {

    private final WorkshopRepository workshopRepository;

    public Workshop proposer(Workshop workshop) {
        workshop.setStatut(StatutWorkshop.PROPOSE);
        return workshopRepository.save(workshop);
    }

    public Workshop valider(Long id) {
        Workshop w = workshopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workshop non trouve"));
        w.setStatut(StatutWorkshop.VALIDE);
        log.info("Workshop valide : {}", w.getTitre());
        return workshopRepository.save(w);
    }

    public Workshop refuser(Long id) {
        Workshop w = workshopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workshop non trouve"));
        w.setStatut(StatutWorkshop.REFUSE);
        return workshopRepository.save(w);
    }

    public List<Workshop> findAll() { return workshopRepository.findAll(); }

    public Workshop findById(Long id) {
        return workshopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workshop non trouve"));
    }
}