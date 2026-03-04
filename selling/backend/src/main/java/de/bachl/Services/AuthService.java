package de.bachl.Services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import de.bachl.db.interfaces.UserRepository;
import de.bachl.db.objects.User;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private IdGenerator idGenerator;

    public String registerUser(String username, String password, String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            throw new RuntimeException("User already exists");
        });

        String id = idGenerator.generateId();
        while (userRepository.findById(id).isPresent()) {
            id = idGenerator.generateId();
        }

        User user = new User(id, username, passwordEncoder.encode(password), email, false, new ArrayList<String>());
        userRepository.save(user);
        return JwtService.generateToken(user.getId());
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return JwtService.generateToken(user.getId());
    }

}
