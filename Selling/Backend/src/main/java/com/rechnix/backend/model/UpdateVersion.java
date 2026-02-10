package com.rechnix.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class UpdateVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String version; // e.g. "1.0.1"

    private String filePath; // Path to the file on disk

    private BigDecimal price; // Price for this specific update

    private LocalDateTime releaseDate;

    private String description;
}
