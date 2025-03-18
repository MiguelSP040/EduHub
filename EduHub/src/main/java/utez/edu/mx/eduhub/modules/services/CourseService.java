package utez.edu.mx.eduhub.modules.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.UserEntity;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.repositories.CourseRepository;
import utez.edu.mx.eduhub.modules.repositories.UserRepository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository repository;

    @Autowired
    private UserRepository userRepository;

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

    public ResponseEntity<?> getStudentsByCourse(String courseId) {
        Optional<Course> optionalCourse = repository.findById(courseId);

        if (optionalCourse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }

        Course course = optionalCourse.get();
        List<String> studentIds = course.getStudentsEnrolled();

        if (studentIds.isEmpty()) {
            return ResponseEntity.ok(List.of()); // Devolver lista vacía en vez de un error
        }

        // Obtener datos completos de los estudiantes desde la base de datos
        List<UserEntity> students = studentIds.stream()
                .map(userRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        return ResponseEntity.ok(students);
    }

    public ResponseEntity<?> requestEnrollment(String courseId, String studentId) {
        Optional<Course> existingCourse = repository.findById(courseId);
        if (existingCourse.isPresent()) {
            Course course = existingCourse.get();

            // Evitar duplicados en solicitudes de inscripción
            if (course.getStudentsEnrolled().contains(studentId)) {
                return ResponseEntity.badRequest().body("El estudiante ya está inscrito en este curso.");
            }

            if (course.getStatus().equals("aceptado")) {
                course.getStudentsEnrolled().add(studentId);
                repository.save(course);
                return ResponseEntity.ok("Solicitud de inscripción enviada.");
            } else {
                return ResponseEntity.badRequest().body("Este curso aún no ha sido aprobado.");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");
    }

    public ResponseEntity<?> manageEnrollment(String courseId, String studentId, boolean accept) {
        Optional<Course> existingCourse = repository.findById(courseId);
        if (existingCourse.isPresent()) {
            Course course = existingCourse.get();

            if (accept) {
                if (!course.getStudentsEnrolled().contains(studentId)) {
                    course.getStudentsEnrolled().add(studentId);
                }
                repository.save(course);
                return ResponseEntity.ok("Estudiante aceptado en el curso.");
            } else {
                course.getStudentsEnrolled().remove(studentId);
                repository.save(course);
                return ResponseEntity.ok("Estudiante rechazado.");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");
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

            existingCourse.setCategory(course.getCategory() != null ? course.getCategory() : existingCourse.getCategory());

            if (course.getStudentsCount() >= 0) {
                existingCourse.setStudentsCount(course.getStudentsCount());
            }

            existingCourse.setClassTime(course.getClassTime() != null ? course.getClassTime() : existingCourse.getClassTime());

            try {
                repository.save(existingCourse);
                return ResponseEntity.ok(existingCourse);
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
