package com.rechnix.backend.controller;

import com.rechnix.backend.model.Purchase;
import com.rechnix.backend.model.UpdateVersion;
import com.rechnix.backend.model.User;
import com.rechnix.backend.repository.PurchaseRepository;
import com.rechnix.backend.repository.UpdateVersionRepository;
import com.rechnix.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/updates")
public class UpdateController {

    @Autowired
    UpdateVersionRepository updateVersionRepository;

    @Autowired
    PurchaseRepository purchaseRepository;

    @Autowired
    UserRepository userRepository;

    private final Path fileStorageLocation = Paths.get("./data/updates").toAbsolutePath().normalize();

    public UpdateController() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @GetMapping
    public ResponseEntity<List<UpdateVersion>> listUpdates() {
        return ResponseEntity.ok(updateVersionRepository.findAll());
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestUpdate() {
        return updateVersionRepository.findAll().stream()
                .max((v1, v2) -> v1.getReleaseDate().compareTo(v2.getReleaseDate()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admin/upload")
    @PreAuthorize("hasRole('ADMIN')") // Logic handled by Security Config or custom check if annotations not enabled
    public ResponseEntity<?> uploadUpdate(@RequestParam("file") MultipartFile file,
            @RequestParam("version") String version,
            @RequestParam("price") BigDecimal price,
            @RequestParam("description") String description) {

        // Simple security check if not using @PreAuthorize properly configured
        User currentUser = getCurrentUser();
        if (currentUser.getRoles().stream().noneMatch(r -> r.equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        try {
            String fileName = version + "_" + file.getOriginalFilename();
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            UpdateVersion update = new UpdateVersion();
            update.setVersion(version);
            update.setPrice(price);
            update.setDescription(description);
            update.setFilePath(targetLocation.toString());
            update.setReleaseDate(LocalDateTime.now());

            updateVersionRepository.save(update);

            return ResponseEntity.ok("Update uploaded successfully");
        } catch (IOException ex) {
            return ResponseEntity.badRequest().body("Could not upload file: " + ex.getMessage());
        }
    }

    @GetMapping("/download/{version}")
    public ResponseEntity<?> downloadUpdate(@PathVariable String version) {
        User user = getCurrentUser();
        UpdateVersion update = updateVersionRepository.findByVersion(version)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        // Check if user bought this update
        boolean hasPurchased = purchaseRepository.findByUserId(user.getId()).stream()
                .anyMatch(p -> p.getType() == Purchase.PurchaseType.UPDATE &&
                        p.getTargetVersion().getId().equals(update.getId()) &&
                        "COMPLETED".equals(p.getStatus()));

        if (!hasPurchased) {
            // Maybe they are admin?
            if (user.getRoles().stream().noneMatch(r -> r.equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(403).body("Sie haben dieses Update nicht erworben.");
            }
        }

        try {
            Path filePath = Paths.get(update.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
