package com.enicarthage.forum.service;

import com.enicarthage.forum.dto.*;
import com.enicarthage.forum.exception.ResourceNotFoundException;
import com.enicarthage.forum.model.Utilisateur;
import com.enicarthage.forum.repository.UtilisateurRepository;
import com.enicarthage.forum.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional @Log4j2 @RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final GoogleOAuth2Service googleOAuth2Service;

    public JwtResponse login(LoginRequest request) {
        log.info("Tentative de connexion : {}", request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse()));
        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouve"));
        if (!user.isActif()) throw new BadCredentialsException("Compte desactive");
        String token = jwtUtil.generateToken(user);
        log.info("Connexion reussie : {}", request.getEmail());
        return JwtResponse.builder()
                .token(token)
                .user(toDTO(user))
                .build();
    }

    public UserDTO register(RegisterRequest request) {
        log.info("Inscription : {}", request.getEmail());
        if (utilisateurRepository.existsByEmail(request.getEmail()))
            throw new IllegalArgumentException("Email deja utilise : " + request.getEmail());
        Utilisateur user = Utilisateur.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(request.getRole())
                .actif(true)
                .build();
        return toDTO(utilisateurRepository.save(user));
    }

    public JwtResponse loginWithGoogle(GoogleLoginRequest request) {
        log.info("Connexion Google avec ID token");
        
        // Verify Google ID token
        com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = 
            googleOAuth2Service.verifyIdToken(request.getIdToken());
        
        if (payload == null) {
            throw new BadCredentialsException("Google ID token verification failed");
        }
        
        // Extract user info
        GoogleOAuth2Service.GoogleUserInfo googleUser = googleOAuth2Service.extractUserInfo(payload);
        log.info("Google user info extracted: {}", googleUser.getEmail());
        
        // Find or create user
        Utilisateur user = utilisateurRepository.findByEmail(googleUser.getEmail())
                .orElseGet(() -> {
                    log.info("Creating new user from Google: {}", googleUser.getEmail());
                    return utilisateurRepository.save(
                        Utilisateur.builder()
                                .nom(googleUser.getNom())
                                .email(googleUser.getEmail())
                                .motDePasse("") // No password for OAuth users
                                .role("MEMBRE") // Default role for new Google users
                                .actif(true)
                                .build()
                    );
                });
        
        if (!user.isActif()) {
            throw new BadCredentialsException("Compte desactive");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user);
        log.info("Google login successful: {}", googleUser.getEmail());
        
        return JwtResponse.builder()
                .token(token)
                .user(toDTO(user))
                .build();
    }

    private UserDTO toDTO(Utilisateur u) {
        return UserDTO.builder()
                .id(u.getId())
                .nom(u.getNom())
                .email(u.getEmail())
                .role(u.getRole())
                .actif(u.isActif())
                .comiteId(u.getComiteId())
                .build();
    }
}
