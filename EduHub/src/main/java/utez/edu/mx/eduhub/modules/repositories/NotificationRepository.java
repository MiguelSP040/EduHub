package utez.edu.mx.eduhub.modules.repositories;
import org.springframework.data.mongodb.repository.MongoRepository;
import utez.edu.mx.eduhub.modules.entities.Notification;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
}