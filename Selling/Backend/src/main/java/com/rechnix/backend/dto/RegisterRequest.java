package com.rechnix.backend.dto;

import lombok.Data;
import java.util.Set;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private Set<String> roles;
}
