package com.rechnix.backend.repository;

import com.rechnix.backend.model.UpdateVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UpdateVersionRepository extends JpaRepository<UpdateVersion, Long> {
    Optional<UpdateVersion> findByVersion(String version);
}
