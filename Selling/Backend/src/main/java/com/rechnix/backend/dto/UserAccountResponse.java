package com.rechnix.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserAccountResponse {
    private String email;
    private String licenseKey;
    private String licenseStatus; // ACTIVE, INACTIVE, etc.
    private String hardwareId;
    private List<PurchaseDTO> purchaseHistory;

    @Data
    public static class PurchaseDTO {
        private Long id;
        private String type; // LICENSE, UPDATE
        private String status; // COMPLETED, PENDING
        private String version; // If update
        private LocalDateTime timestamp;
    }
}
