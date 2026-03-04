package de.bachl.db.interfaces;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import de.bachl.db.objects.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
