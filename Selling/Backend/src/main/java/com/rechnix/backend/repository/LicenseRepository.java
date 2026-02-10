package com.rechnix.backend.repository;

import com.rechnix.backend.model.License;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LicenseRepository extends JpaRepository<License, Long> {
    Optional<License> findByLicenseKey(String licenseKey);

    Optional<License> findByUserId(Long userId);
}
