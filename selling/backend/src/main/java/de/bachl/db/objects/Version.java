package de.bachl.db.objects;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document("Versions")
public class Version {
    @Id
    private String id;
    private String version;
    private String date;
    private String description;
    private String fileid;
    private boolean ispayed;
}
