package com.rechnix.backend.controller;

import com.rechnix.backend.dto.LoginRequest;
import com.rechnix.backend.dto.RegisterRequest;
import com.rechnix.backend.model.User;
import com.rechnix.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    com.rechnix.backend.repository.PurchaseRepository purchaseRepository;

    @Autowired
    org.springframework.security.web.context.SecurityContextRepository securityContextRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request,
            HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        securityContextRepository.saveContext(context, request, response);

        return ResponseEntity.ok("User logged in successfully");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRoles();
        Set<String> roles = new HashSet<>();

        if (strRoles == null) {
            roles.add("ROLE_USER");
        } else {
            roles.addAll(strRoles);
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/account")
    public ResponseEntity<?> getAccount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        com.rechnix.backend.dto.UserAccountResponse response = new com.rechnix.backend.dto.UserAccountResponse();
        response.setEmail(user.getEmail());

        if (user.getLicense() != null) {
            response.setLicenseKey(user.getLicense().getLicenseKey());
            response.setLicenseStatus(user.getLicense().isActive() ? "Aktiv" : "Inaktiv");
            response.setHardwareId(user.getLicense().getHardwareId());
        } else {
            response.setLicenseStatus("Keine Lizenz");
        }

        java.util.List<com.rechnix.backend.dto.UserAccountResponse.PurchaseDTO> purchaseDTOs = purchaseRepository
                .findByUserId(user.getId()).stream()
                .map(p -> {
                    com.rechnix.backend.dto.UserAccountResponse.PurchaseDTO dto = new com.rechnix.backend.dto.UserAccountResponse.PurchaseDTO();
                    dto.setId(p.getId());
                    dto.setType(p.getType().toString());
                    dto.setStatus(p.getStatus());
                    if (p.getTargetVersion() != null) {
                        dto.setVersion(p.getTargetVersion().getVersion());
                    }
                    dto.setTimestamp(p.getTimestamp());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());

        response.setPurchaseHistory(purchaseDTOs);

        return ResponseEntity.ok(response);
    }
}
