package utez.edu.mx.eduhub.modules.services.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.course.Sesion;
import utez.edu.mx.eduhub.modules.repositories.course.SesionRepository;
import java.util.*;

@Service
public class SesionService {
    @Autowired
    private SesionRepository sesionRepository;

    public List<Sesion> getAll() {
        return sesionRepository.findAll();
    }

    public Sesion getById(String id) {
        return sesionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Sesión no encontrada con ID: " + id));
    }

    public Sesion create(Sesion sesion) {
        return sesionRepository.save(sesion);
    }

    public Sesion update(Sesion sesion) {
        Sesion currentSession = sesionRepository.findById(sesion.getId())
        .orElseThrow(() -> new RuntimeException("Sesión no encontrada con ID: " + sesion.getId()));
        currentSession.setNameSesion(sesion.getNameSesion());
        currentSession.setDateStartSesion(sesion.getDateStartSesion());
        currentSession.setDateEndSesion(sesion.getDateEndSesion());
        currentSession.setChapter(sesion.getChapter());
        return sesionRepository.save(currentSession);
    }

    public void delete(String id) {
        sesionRepository.deleteById(id);
    }
}
