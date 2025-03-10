package utez.edu.mx.eduhub.modules.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.repositories.CourseRepository;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository repository;

    public List<Course> findAll() {
        return repository.findAll();
    }

    public Optional<Course> findById(String id) {
        return repository.findById(id);
    }

    public List<Course> findByInstructorId(String docenteId) {
        return repository.findByDocenteId(docenteId);
    }

    public ResponseEntity<?> save(Course course) {
        try {
            if (course.getDateEnd().before(course.getDateStart())) {
                return ResponseEntity.badRequest().body("La fecha fin no puede ser menor a la de inicio");
            }
            course.setArchived(false);
            course.setPublished(false);
            course.setStatus("pendiente");

            repository.save(course);
            return ResponseEntity.ok("Curso registrado, pendiente de aprobación.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el curso");
        }
    }
}
