package utez.edu.mx.eduhub.modules.services.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.entities.course.Session;
import utez.edu.mx.eduhub.modules.repositories.CourseRepository;
import utez.edu.mx.eduhub.modules.repositories.course.SessionRepository;
import utez.edu.mx.eduhub.utils.exceptions.NotFoundException;

import java.util.*;

@Service
public class SessionService {
    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private CourseRepository courseRepository;

    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(sessionRepository.findAll());
    }

    public ResponseEntity<?> findById(String id) {
        Session existingSession = sessionRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Sesión no encontrada con ID "+ id));
        return ResponseEntity.ok(existingSession);
    }

    public ResponseEntity<?> findByCourseId(String courseId) {
        List<Session> sessions = sessionRepository.findByCourseId(courseId);
        return ResponseEntity.ok(sessions);
    }

    public ResponseEntity<?> save(Session session) {
        try {
            if (session.getNameSession() == null || session.getNameSession().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre de la sesión es obligatorio");
            }

            // Find the course by ID
            Course course = courseRepository.findById(session.getCourseId())
                .orElseThrow(() -> new NotFoundException("Curso no encontrado con ID: " + session.getCourseId()));

            // Add the session to the course's session list
            course.getSessions().add(session);

            // Save the session and the course
            sessionRepository.save(session);
            courseRepository.save(course);

            return ResponseEntity.ok("Sesión guardada exitosamente");
        } catch (Exception e) {
            System.out.println("Error al guardar sesión: " + e.getMessage());
            return ResponseEntity.status(500).body("Error interno del servidor al guardar sesión");
        }
    }

    public ResponseEntity<?> update(Session session) {
        try {
            sessionRepository.save(session);
            return ResponseEntity.ok("Sesión actualizada exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al actualizar la sesión");
        }
    }

    public ResponseEntity<?> deleteById(String id) {
        Optional<Session> session = sessionRepository.findById(id);
        if (session.isPresent()) {
            try {
                sessionRepository.deleteById(id);
                return ResponseEntity.ok("Sesión eliminada exitosamente");
            } catch (Exception e) {
                System.out.println("Error al eliminar sesión: " + e.getMessage());
                return ResponseEntity.status(500).body("Error interno del servidor al eliminar sesión");
            }
        } else {
            return ResponseEntity.status(404).body("Sesión no encontrada");
        }
    }
}