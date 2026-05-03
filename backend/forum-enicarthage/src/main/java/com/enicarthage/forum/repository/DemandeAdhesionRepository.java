package com.enicarthage.forum.repository;

import com.enicarthage.forum.model.DemandeAdhesion;
import com.enicarthage.forum.model.NomComite;
import com.enicarthage.forum.model.PosteVise;
import com.enicarthage.forum.model.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DemandeAdhesionRepository extends JpaRepository<DemandeAdhesion, Long> {

    List<DemandeAdhesion> findByStatutOrderByScoreIADesc(StatutDemande statut);

    List<DemandeAdhesion> findByPosteViseOrderByScoreIADesc(PosteVise posteVise);

    List<DemandeAdhesion> findByPosteViseAndStatutOrderByScoreIADesc(PosteVise posteVise, StatutDemande statut);

    List<DemandeAdhesion> findByComiteViseAndPosteViseAndStatutOrderByScoreIADesc(
            NomComite comiteVise, PosteVise posteVise, StatutDemande statut);

    List<DemandeAdhesion> findAllByOrderByDateDepotDesc();

    boolean existsByEmailAndPosteViseAndStatut(String email, PosteVise posteVise, StatutDemande statut);

    long countByStatut(StatutDemande statut);
}