package com.enicarthage.forum.repository;
import com.enicarthage.forum.model.Tache;
import com.enicarthage.forum.model.StatutTache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
public interface TacheRepository extends JpaRepository<Tache, Long> {
    List<Tache> findByStatut(StatutTache statut);
    List<Tache> findByComiteId(Long comiteId);
    List<Tache> findByMembreId(Long membreId);
    List<Tache> findByDateFinBeforeAndStatutNot(LocalDate date, StatutTache statut);
    @Query("SELECT COUNT(t) FROM Tache t WHERE t.comite.id = :comiteId AND t.statut = :statut")
    long countByComiteIdAndStatut(Long comiteId, StatutTache statut);
    long countByComiteId(Long comiteId);
}
