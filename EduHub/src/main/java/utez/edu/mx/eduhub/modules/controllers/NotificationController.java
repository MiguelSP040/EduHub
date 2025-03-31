package utez.edu.mx.eduhub.modules.controllers;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.eduhub.modules.entities.Notification;
import utez.edu.mx.eduhub.modules.services.NotificationService;
import utez.edu.mx.eduhub.utils.security.UserDetailsImpl;

import java.util.List;

@RestController
@RequestMapping("/eduhub/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping
    public List<Notification> getNotifications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return service.getUserNotifications(userDetails.getId());
    }

    @PutMapping("/mark-as-read/{id}")
    public void markAsRead(@PathVariable String id, @RequestParam boolean read) {
        service.markAsRead(id, read);
    }
}
