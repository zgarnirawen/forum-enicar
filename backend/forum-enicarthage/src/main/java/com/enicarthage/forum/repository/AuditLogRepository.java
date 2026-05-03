package com.enicarthage.forum.repository;
import com.enicarthage.forum.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUtilisateurOrderByDateActionDesc(String utilisateur);
}
