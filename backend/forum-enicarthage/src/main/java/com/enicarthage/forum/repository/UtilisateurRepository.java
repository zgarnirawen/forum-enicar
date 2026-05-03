package com.enicarthage.forum.repository;
import com.enicarthage.forum.model.Utilisateur;
import com.enicarthage.forum.model.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Utilisateur> findByRole(RoleEnum role);
    List<Utilisateur> findByActifTrue();
}
