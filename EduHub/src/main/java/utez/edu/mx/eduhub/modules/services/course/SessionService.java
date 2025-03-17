package utez.edu.mx.eduhub.modules.services.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.course.Session;
import utez.edu.mx.eduhub.modules.repositories.course.SessionRepository;
import utez.edu.mx.eduhub.utils.exceptions.NotFoundException;

import java.util.*;

@Service
public class SessionService {
    @Autowired
    private SessionRepository sessionRepository;

    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(sessionRepository.findAll());
    }

    public ResponseEntity<?> findById(String id) {
        Session existingSession = sessionRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Sesión no encontrada con ID "+ id));
        return ResponseEntity.ok(existingSession);
    }

    public ResponseEntity<?> save(Session session) {
        try{
            sessionRepository.save(session);
            return ResponseEntity.ok("Sesión guardada exitosamente");
        }catch(Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al guardar la sesión");
        }
    }

    public ResponseEntity<?> update(Session session) {
        Session currentSession = sessionRepository.findById(session.getId())
        .orElseThrow(() -> new NotFoundException("Sesión no encontrada con ID: " + session.getId()));
        currentSession.setNameSession(null != session.getNameSession() ? session.getNameSession() : currentSession.getNameSession());
        currentSession.setDateStartSession(null != session.getDateStartSession() ? session.getDateStartSession() : currentSession.getDateStartSession());
        currentSession.setDateEndSession(null != session.getDateEndSession() ? session.getDateEndSession() : currentSession.getDateEndSession());
        currentSession.setMultimedia(null != session.getMultimedia() ? session.getMultimedia() : currentSession.getMultimedia());
        currentSession.setContent(null != session.getContent() ? session.getContent() : currentSession.getContent());
        try {
            sessionRepository.save(currentSession);
            return ResponseEntity.ok("Sesión actualizada exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al actualizar la sesión");
        }
    }

    public ResponseEntity<?> deleteById(String id) {
        sessionRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Sesión no encontrada con ID: " + id));
        try {
            sessionRepository.deleteById(id);
            return ResponseEntity.ok("Sesión eliminada exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al eliminar la sesión");
        }
    }
}
