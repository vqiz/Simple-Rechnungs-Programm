package com.rechnix.backend.service;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.rechnix.backend.model.*;
import com.rechnix.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private UpdateVersionRepository updateVersionRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public String createLicenseCheckoutSession(User user, String priceId) throws Exception {
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/payment/cancel")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPrice(priceId)
                        .build())
                .setCustomerEmail(user.getEmail())
                .build();

        Session session = Session.create(params);

        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setStripeSessionId(session.getId());
        purchase.setType(Purchase.PurchaseType.LICENSE);
        purchase.setStatus("PENDING");
        purchase.setTimestamp(LocalDateTime.now());
        purchaseRepository.save(purchase);

        return session.getUrl();
    }

    public String createUpdateCheckoutSession(User user, Long updateId, String priceId) throws Exception {
        UpdateVersion update = updateVersionRepository.findById(updateId)
                .orElseThrow(() -> new RuntimeException("Update not found"));

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/payment/cancel")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPrice(priceId) // Assuming priceId is passed or we map it from update entity
                        .build())
                .setCustomerEmail(user.getEmail())
                .build();

        Session session = Session.create(params);

        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setStripeSessionId(session.getId());
        purchase.setType(Purchase.PurchaseType.UPDATE);
        purchase.setTargetVersion(update);
        purchase.setStatus("PENDING");
        purchase.setTimestamp(LocalDateTime.now());
        purchaseRepository.save(purchase);

        return session.getUrl();
    }

    @Transactional
    public boolean verifyPayment(String sessionId) throws Exception {
        Purchase purchase = purchaseRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        if ("COMPLETED".equals(purchase.getStatus())) {
            return true;
        }

        Session session = Session.retrieve(sessionId);
        if ("paid".equals(session.getPaymentStatus())) {
            purchase.setStatus("COMPLETED");
            purchaseRepository.save(purchase);

            if (purchase.getType() == Purchase.PurchaseType.LICENSE) {
                createLicenseForUser(purchase.getUser());
            }
            // If UPDATE, we rely on the Purchase record to grant access

            return true;
        }
        return false;
    }

    private void createLicenseForUser(User user) {
        if (user.getLicense() != null)
            return; // Already has license

        License license = new License();
        license.setUser(user);
        license.setLicenseKey(UUID.randomUUID().toString());
        license.setActive(true);
        license.setPurchaseDate(LocalDateTime.now());
        licenseRepository.save(license);
    }
}
