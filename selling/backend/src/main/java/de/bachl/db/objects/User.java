package de.bachl.db.objects;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Document("Users")
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private boolean admin;
    private ArrayList<String> purchasedids;

    private boolean isadmin() {
        return admin;
    }
}
