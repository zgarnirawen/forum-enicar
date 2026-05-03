package com.enicarthage.forum.controller;

import com.enicarthage.forum.model.ConfigurationSysteme;
import com.enicarthage.forum.model.PhaseRecrutement;
import com.enicarthage.forum.service.ConfigurationGlobaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuration")
@RequiredArgsConstructor
public class ConfigurationSystemeController {

    private final ConfigurationGlobaleService configService;

    @GetMapping
    public ConfigurationSysteme getConfiguration() {
        return configService.getConfiguration();
    }

    @PutMapping("/phase")
    @PreAuthorize("hasRole('ADMIN')")
    public ConfigurationSysteme setPhaseActive(@RequestParam PhaseRecrutement phase) {
        return configService.setPhaseActive(phase);
    }
}
