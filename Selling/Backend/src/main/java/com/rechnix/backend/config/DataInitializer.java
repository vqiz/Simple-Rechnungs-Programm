package com.rechnix.backend.config;

import com.rechnix.backend.model.User;
import com.rechnix.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (!userRepository.existsByEmail("admin@rechnix.com")) {
                User admin = new User();
                admin.setEmail("admin@rechnix.com");
                admin.setPassword(encoder.encode("admin")); // Change in production
                admin.setRoles(Set.of("ROLE_ADMIN", "ROLE_USER"));
                userRepository.save(admin);
                System.out.println("Admin user created: admin@rechnix.com / admin");
            }
        };
    }
}
