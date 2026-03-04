package de.bachl.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class DbChecker implements ApplicationListener<ApplicationReadyEvent> {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try {
            mongoTemplate.getDb().listCollectionNames().first();
            log.info("✅ MongoDB ist verbunden!");
        } catch (Exception e) {
            log.info("❌ MongoDB Verbindung fehlgeschlagen: {}", e.getMessage());
        }
    }

}
