package com.rechnix.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class License {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String licenseKey;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String hardwareId; // Assigned on first use

    private boolean active;

    private LocalDateTime purchaseDate;

    // Tracks the latest version this license is valid for (if using version-based
    // updates)
    // Or we simply check Purchase history for updates.
    // For now, let's say owning a license gives access to the base version, updates
    // are separate.
}
