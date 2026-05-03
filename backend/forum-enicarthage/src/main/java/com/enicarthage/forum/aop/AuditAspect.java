package com.enicarthage.forum.aop;

import com.enicarthage.forum.model.AuditLog;
import com.enicarthage.forum.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Aspect @Component @Log4j2 @RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @AfterReturning("execution(* com.enicarthage.forum.service.*.creer(..)) || " +
                    "execution(* com.enicarthage.forum.service.*.accepter(..)) || " +
                    "execution(* com.enicarthage.forum.service.*.refuser(..))")
    public void audit(JoinPoint jp) {
        try {
            String user = SecurityContextHolder.getContext().getAuthentication() != null
                    ? SecurityContextHolder.getContext().getAuthentication().getName() : "system";
            AuditLog log = AuditLog.builder()
                    .action(jp.getSignature().getName())
                    .details("Args: " + Arrays.toString(jp.getArgs()))
                    .dateAction(LocalDateTime.now())
                    .utilisateur(user)
                    .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            log.warn("Audit failed: {}", e.getMessage());
        }
    }
}
