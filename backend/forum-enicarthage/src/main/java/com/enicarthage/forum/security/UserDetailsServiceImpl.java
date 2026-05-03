package com.enicarthage.forum.security;

import com.enicarthage.forum.model.Utilisateur;
import com.enicarthage.forum.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service @RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new UserPrincipal(u);
    }

    public static class UserPrincipal implements UserDetails {
        private final Utilisateur utilisateur;

        public UserPrincipal(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

        public Long getId() { return utilisateur.getId(); }
        public String getEmail() { return utilisateur.getEmail(); }
        public Utilisateur getUtilisateur() { return utilisateur; }

        @Override public String getUsername() { return utilisateur.getEmail(); }
        @Override public String getPassword() { return utilisateur.getMotDePasse(); }
        @Override public boolean isEnabled() { return utilisateur.isActif(); }
        @Override public boolean isAccountNonExpired() { return true; }
        @Override public boolean isAccountNonLocked() { return true; }
        @Override public boolean isCredentialsNonExpired() { return true; }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return List.of(new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name()));
        }
    }
}
