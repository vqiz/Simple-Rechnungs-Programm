package com.rechnix.backend.repository;

import com.rechnix.backend.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Optional<Purchase> findByStripeSessionId(String stripeSessionId);

    List<Purchase> findByUserId(Long userId);
}
