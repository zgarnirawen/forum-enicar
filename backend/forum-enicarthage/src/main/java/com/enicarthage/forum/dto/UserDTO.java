package com.enicarthage.forum.dto;
import com.enicarthage.forum.model.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDTO {
    private Long id;
    private String nom;
    private String email;
    private RoleEnum role;
    private boolean actif;
    private Long comiteId;
}
