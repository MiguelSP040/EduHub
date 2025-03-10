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

    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    public ResponseEntity<?> findById(String id) {
        Optional<Course> existingCourse = repository.findById(id);
        if (existingCourse.isPresent()) {
            return ResponseEntity.ok(existingCourse.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }
    }

    public ResponseEntity<?> findByInstructorId(String docenteId) {
        List<Course> courses = repository.findByDocenteId(docenteId);
        if (courses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron cursos para este instructor");
        }
        return ResponseEntity.ok(courses);
    }

    public ResponseEntity<?> save(Course course) {
        try {
            if (course.getDateEnd().before(course.getDateStart())) {
                return ResponseEntity.badRequest().body("La fecha de fin no puede ser menor a la de inicio");
            }
            course.setArchived(false);
            course.setPublished(false);
            course.setStatus("pendiente");

            repository.save(course);
            return ResponseEntity.ok("Curso registrado exitosamente, pendiente de aprobación.");
        } catch (Exception e) {
            System.out.println("Error al guardar el curso: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el curso.");
        }
    }

    public ResponseEntity<?> update(Course course) {
        Optional<Course> existingCourseOptional = repository.findById(course.getId());
        if (existingCourseOptional.isPresent()) {
            Course existingCourse = existingCourseOptional.get();

            existingCourse.setTitle(course.getTitle() != null ? course.getTitle() : existingCourse.getTitle());
            existingCourse.setDescription(course.getDescription() != null ? course.getDescription() : existingCourse.getDescription());
            existingCourse.setDateStart(course.getDateStart() != null ? course.getDateStart() : existingCourse.getDateStart());
            existingCourse.setDateEnd(course.getDateEnd() != null ? course.getDateEnd() : existingCourse.getDateEnd());

            if (existingCourse.getDateEnd().before(existingCourse.getDateStart())) {
                return ResponseEntity.badRequest().body("La fecha de fin no puede ser menor a la de inicio");
            }

            existingCourse.setArchived(course.getArchived() != null ? course.getArchived() : existingCourse.getArchived());
            existingCourse.setPublished(course.getPublished() != null ? course.getPublished() : existingCourse.getPublished());
            existingCourse.setStatus(course.getStatus() != null ? course.getStatus() : existingCourse.getStatus());

            try {
                repository.save(existingCourse);
                return ResponseEntity.ok("Curso actualizado exitosamente");
            } catch (Exception e) {
                System.out.println("Error al actualizar el curso: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al actualizar el curso");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }
    }

    public ResponseEntity<?> deleteById(String id) {
        Optional<Course> existingCourse = repository.findById(id);
        if (existingCourse.isPresent()) {
            try {
                repository.deleteById(id);
                return ResponseEntity.ok("Curso eliminado exitosamente");
            } catch (Exception e) {
                System.out.println("Error al eliminar el curso: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el curso");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }
    }
}
