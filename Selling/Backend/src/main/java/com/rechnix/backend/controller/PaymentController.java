package com.rechnix.backend.controller;

import com.rechnix.backend.model.User;
import com.rechnix.backend.repository.UserRepository;
import com.rechnix.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/checkout/license")
    public ResponseEntity<?> createLicenseCheckout(@RequestBody Map<String, String> payload) {
        try {
            String priceId = payload.get("priceId");
            User user = getCurrentUser();
            String url = paymentService.createLicenseCheckoutSession(user, priceId);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/checkout/update")
    public ResponseEntity<?> createUpdateCheckout(@RequestBody Map<String, Object> payload) {
        try {
            Long updateId = Long.valueOf(payload.get("updateId").toString());
            String priceId = payload.get("priceId").toString();
            User user = getCurrentUser();
            String url = paymentService.createUpdateCheckoutSession(user, updateId, priceId);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        try {
            String sessionId = payload.get("sessionId");
            boolean success = paymentService.verifyPayment(sessionId);
            return success ? ResponseEntity.ok("Payment verified and processed")
                    : ResponseEntity.badRequest().body("Payment not successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
