package com.enicarthage.forum.service;

import com.enicarthage.forum.model.ConfigurationSysteme;
import com.enicarthage.forum.model.PhaseRecrutement;
import com.enicarthage.forum.repository.ConfigurationSystemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ConfigurationGlobaleService {

    private final ConfigurationSystemeRepository repository;

    public ConfigurationSysteme getConfiguration() {
        return repository.findAll().stream().findFirst().orElseGet(() -> {
            ConfigurationSysteme config = new ConfigurationSysteme();
            config.setPhaseRecrutementActive(PhaseRecrutement.PHASE_1_COORDINATRICE);
            return repository.save(config);
        });
    }

    public PhaseRecrutement getPhaseActive() {
        return getConfiguration().getPhaseRecrutementActive();
    }

    public ConfigurationSysteme setPhaseActive(PhaseRecrutement phase) {
        ConfigurationSysteme config = getConfiguration();
        config.setPhaseRecrutementActive(phase);
        return repository.save(config);
    }
}
