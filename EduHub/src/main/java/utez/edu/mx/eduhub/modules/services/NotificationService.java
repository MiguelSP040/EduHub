package utez.edu.mx.eduhub.modules.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.Notification;
import utez.edu.mx.eduhub.modules.repositories.NotificationRepository;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    public void sendNotification(String userId, String title, String message, String type, String relatedModule, String relatedId) {
        Notification notification = new Notification(userId, title, message, type, relatedId, relatedModule);
        repository.save(notification);
    }

    public List<Notification> getUserNotifications(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId, boolean read) {
        repository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(read);
            repository.save(notification);
        });
    }
}
