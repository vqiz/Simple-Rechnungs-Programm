package de.bachl.Services;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;

@Service
public class IdGenerator {

    private final SecureRandom random = new SecureRandom();

    public String generateId() {
        long number = Math.abs(random.nextLong() % 9_000_000_000_000_000L) + 1_000_000_000_000_000L;
        return String.valueOf(number);
    }
}
