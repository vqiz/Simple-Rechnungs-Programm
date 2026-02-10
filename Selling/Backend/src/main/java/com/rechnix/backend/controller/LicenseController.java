package com.rechnix.backend.controller;

import com.rechnix.backend.model.License;
import com.rechnix.backend.repository.LicenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/license")
public class LicenseController {

    @Autowired
    LicenseRepository licenseRepository;

    @PostMapping("/activate")
    public ResponseEntity<?> activateLicense(@RequestBody Map<String, String> payload) {
        String licenseKey = payload.get("licenseKey");
        String hardwareId = payload.get("hardwareId");

        Optional<License> licenseOpt = licenseRepository.findByLicenseKey(licenseKey);

        if (licenseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid License Key");
        }

        License license = licenseOpt.get();

        if (!license.isActive()) {
            return ResponseEntity.badRequest().body("License is inactive");
        }

        if (license.getHardwareId() == null) {
            // First time activation
            license.setHardwareId(hardwareId);
            licenseRepository.save(license);
            return ResponseEntity.ok("License Activated Successfully");
        } else {
            // Check if hardware ID matches
            if (license.getHardwareId().equals(hardwareId)) {
                return ResponseEntity.ok("License Verified");
            } else {
                return ResponseEntity.status(403).body("License already in use on another machine");
            }
        }
    }
}
