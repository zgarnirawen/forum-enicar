package com.enicarthage.forum.repository;
import com.enicarthage.forum.model.Membre;
import com.enicarthage.forum.model.StatutMembre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface MembreRepository extends JpaRepository<Membre, Long> {
    List<Membre> findByComiteId(Long comiteId);
    List<Membre> findByComiteIdAndStatut(Long comiteId, StatutMembre statut);
    List<Membre> findByUtilisateurId(Long utilisateurId);
    Optional<Membre> findByUtilisateurIdAndComiteId(Long utilisateurId, Long comiteId);
    boolean existsByUtilisateurIdAndComiteId(Long utilisateurId, Long comiteId);
}
