package com.enicarthage.forum.scheduler;

import com.enicarthage.forum.service.TacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor @Log4j2
public class TacheScheduler {

    private final TacheService tacheService;

    // Run every hour
    @Scheduled(cron = "0 0 * * * *")
    public void detecterRetards() {
        log.info("Scheduler: detection des retards...");
        tacheService.detecterRetards();
    }
}
