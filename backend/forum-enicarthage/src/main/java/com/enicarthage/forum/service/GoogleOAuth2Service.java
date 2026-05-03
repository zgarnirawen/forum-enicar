package com.enicarthage.forum.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Service
@Log4j2
@RequiredArgsConstructor
public class GoogleOAuth2Service {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    /**
     * Verify Google ID Token and extract user info
     */
    public GoogleIdToken.Payload verifyIdToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(), JSON_FACTORY)
                    .setAudience(java.util.Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                log.info("ID Token verified successfully");
                return idToken.getPayload();
            } else {
                log.error("Invalid ID token");
                return null;
            }
        } catch (GeneralSecurityException | IOException e) {
            log.error("Error verifying Google ID token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Extract user info from Google ID Token payload
     */
    public GoogleUserInfo extractUserInfo(GoogleIdToken.Payload payload) {
        return GoogleUserInfo.builder()
                .email((String) payload.get("email"))
                .nom((String) payload.get("name"))
                .picture((String) payload.get("picture"))
                .build();
    }

    @lombok.Data
    @lombok.Builder
    public static class GoogleUserInfo {
        private String email;
        private String nom;
        private String picture;
    }
}
