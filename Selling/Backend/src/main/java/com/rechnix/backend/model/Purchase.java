package com.rechnix.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stripeSessionId;

    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private PurchaseType type;

    // If it's an update purchase
    @ManyToOne
    private UpdateVersion targetVersion;

    private String status; // PENDING, COMPLETED, FAILED

    private LocalDateTime timestamp;

    public enum PurchaseType {
        LICENSE, UPDATE
    }
}
