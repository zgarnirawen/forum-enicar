package com.enicarthage.forum.service;

import com.enicarthage.forum.dto.DemandeAdhesionDTO;
import com.enicarthage.forum.exception.ResourceNotFoundException;
import com.enicarthage.forum.model.*;
import com.enicarthage.forum.repository.DemandeAdhesionRepository;
import com.enicarthage.forum.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class DemandeAdhesionService {

    private final DemandeAdhesionRepository demandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private static final String UPLOAD_DIR = "uploads/candidatures/";

    public DemandeAdhesionDTO soumettre(String nom, String email, String telephone, String linkedinUrl,
                                        PosteVise posteVise, NomComite comiteVise, String motivation, MultipartFile fichierCV) {
        
        if (demandeRepository.existsByEmailAndPosteViseAndStatut(email, posteVise, StatutDemande.EN_ATTENTE)) {
            throw new IllegalArgumentException("Vous avez déjà une candidature en attente pour ce poste.");
        }

        String path = null;
        if (fichierCV != null && !fichierCV.isEmpty()) {
            path = UPLOAD_DIR + System.currentTimeMillis() + "_" + fichierCV.getOriginalFilename();
            try {
                Files.createDirectories(Paths.get(UPLOAD_DIR));
                Files.copy(fichierCV.getInputStream(), Paths.get(path), StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                log.error("Erreur sauvegarde fichier : {}", e.getMessage());
            }
        }

        DemandeAdhesion demande = DemandeAdhesion.builder()
                .nom(nom)
                .email(email)
                .telephone(telephone)
                .linkedinUrl(linkedinUrl)
                .posteVise(posteVise)
                .comiteVise(comiteVise)
                .motivation(motivation)
                .cheminCV(path)
                .statut(StatutDemande.EN_ATTENTE)
                .dateDepot(LocalDateTime.now())
                .build();

        DemandeAdhesion saved = demandeRepository.save(demande);
        analyserAvecIA(saved);
        return toDTO(saved);
    }

    public void analyserAvecIA(DemandeAdhesion demande) {
        // Simulation IA
        double scoreSimule = Math.round(Math.random() * 3000.0) / 100.0 + 70.0; // 70-100
        demande.setScoreIA(scoreSimule);
        demande.setJustificationIA("Analyse simulée : Le profil correspond bien aux attentes du poste de " + demande.getPosteVise());
        demandeRepository.save(demande);
    }

    private final ConfigurationGlobaleService configService;

    public DemandeAdhesionDTO accepter(Long id) {
        DemandeAdhesion demande = demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée"));

        PhaseRecrutement phase = configService.getPhaseActive();
        
        if (demande.getPosteVise() == PosteVise.COORDINATRICE && phase != PhaseRecrutement.PHASE_1_COORDINATRICE) {
            throw new IllegalStateException("Le recrutement de la coordinatrice est clos ou pas encore ouvert.");
        }
        if (demande.getPosteVise() == PosteVise.CHEF_COMITE && phase != PhaseRecrutement.PHASE_2_CHEFS) {
            throw new IllegalStateException("Le recrutement des chefs de comité n'est pas actif.");
        }
        if (demande.getPosteVise() == PosteVise.MEMBRE && phase != PhaseRecrutement.PHASE_3_MEMBRES) {
            throw new IllegalStateException("Le recrutement des membres n'est pas actif.");
        }

        demande.setStatut(StatutDemande.ACCEPTE);
        demande.setDateDecision(LocalDateTime.now());

        // Création du compte
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        RoleEnum role = mapPosteToRole(demande.getPosteVise());
        
        Utilisateur user = Utilisateur.builder()
                .nom(demande.getNom())
                .email(demande.getEmail())
                .motDePasse(passwordEncoder.encode(tempPassword))
                .role(role)
                .actif(true)
                .build();
        
        utilisateurRepository.save(user);
        demande.setUtilisateurIdCree(user.getId());
        
        // Envoi email
        envoyerEmailAcceptation(demande.getEmail(), demande.getNom(), role.name(), tempPassword);

        return toDTO(demandeRepository.save(demande));
    }

    public DemandeAdhesionDTO refuser(Long id, String commentaire) {
        DemandeAdhesion demande = demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée"));

        demande.setStatut(StatutDemande.REFUSE);
        demande.setDateDecision(LocalDateTime.now());
        demande.setCommentaireRefus(commentaire);

        return toDTO(demandeRepository.save(demande));
    }

    private RoleEnum mapPosteToRole(PosteVise poste) {
        switch (poste) {
            case COORDINATRICE: return RoleEnum.COORDINATRICE;
            case CHEF_COMITE: return RoleEnum.CHEF_COMITE;
            case MEMBRE: return RoleEnum.MEMBRE;
            default: return RoleEnum.MEMBRE;
        }
    }

    private void envoyerEmailAcceptation(String email, String nom, String role, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Bienvenue au Forum ENICarthage !");
            message.setText("Bonjour " + nom + ",\n\n" +
                    "Félicitations, votre candidature pour le rôle de " + role + " a été acceptée !\n\n" +
                    "Voici vos identifiants de connexion temporaires :\n" +
                    "Email : " + email + "\n" +
                    "Mot de passe : " + password + "\n\n" +
                    "Veuillez vous connecter à l'application et changer votre mot de passe.\n\n" +
                    "L'équipe Forum ENICarthage.");
            mailSender.send(message);
            log.info("Email d'acceptation envoyé à {}", email);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email à {} : {}", email, e.getMessage());
        }
    }

    public List<DemandeAdhesionDTO> findAll() {
        return demandeRepository.findAllByOrderByDateDepotDesc().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DemandeAdhesionDTO findById(Long id) {
        return demandeRepository.findById(id).map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Demande non trouvée"));
    }

    public List<DemandeAdhesionDTO> findByStatut(StatutDemande statut) {
        return demandeRepository.findByStatutOrderByScoreIADesc(statut).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<DemandeAdhesionDTO> findByPoste(PosteVise poste) {
        return demandeRepository.findByPosteViseOrderByScoreIADesc(poste).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<DemandeAdhesionDTO> findByPosteAndStatut(PosteVise poste, StatutDemande statut) {
        return demandeRepository.findByPosteViseAndStatutOrderByScoreIADesc(poste, statut).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<DemandeAdhesionDTO> findByComiteAndPoste(NomComite comite, PosteVise poste) {
        return demandeRepository.findByComiteViseAndPosteViseAndStatutOrderByScoreIADesc(comite, poste, StatutDemande.EN_ATTENTE)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private DemandeAdhesionDTO toDTO(DemandeAdhesion d) {
        return DemandeAdhesionDTO.builder()
                .id(d.getId())
                .nom(d.getNom())
                .email(d.getEmail())
                .telephone(d.getTelephone())
                .linkedinUrl(d.getLinkedinUrl())
                .posteVise(d.getPosteVise())
                .comiteVise(d.getComiteVise())
                .motivation(d.getMotivation())
                .cheminCV(d.getCheminCV())
                .scoreIA(d.getScoreIA())
                .justificationIA(d.getJustificationIA())
                .statut(d.getStatut())
                .commentaireRefus(d.getCommentaireRefus())
                .dateDepot(d.getDateDepot())
                .dateDecision(d.getDateDecision())
                .utilisateurIdCree(d.getUtilisateurIdCree())
                .build();
    }
}
