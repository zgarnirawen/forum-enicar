package com.enicarthage.forum.controller;

import com.enicarthage.forum.model.Workshop;
import com.enicarthage.forum.service.WorkshopService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workshops")
@RequiredArgsConstructor
public class WorkshopController {

    private final WorkshopService workshopService;

    @GetMapping
    public List<Workshop> getAll() { return workshopService.findAll(); }

    @GetMapping("/{id}")
    public Workshop getById(@PathVariable Long id) { return workshopService.findById(id); }

    @PostMapping
    public Workshop proposer(@RequestBody Workshop workshop) {
        return workshopService.proposer(workshop);
    }

    @PutMapping("/{id}/valider")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE')")
    public Workshop valider(@PathVariable Long id) { return workshopService.valider(id); }

    @PutMapping("/{id}/refuser")
    @PreAuthorize("hasAnyRole('ADMIN','COMITE_PILOTAGE')")
    public Workshop refuser(@PathVariable Long id) { return workshopService.refuser(id); }
}