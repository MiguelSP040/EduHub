package utez.edu.mx.eduhub.modules.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.UserEntity;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.entities.course.Rating;
import utez.edu.mx.eduhub.modules.entities.course.Session;
import utez.edu.mx.eduhub.modules.entities.course.StudentEnrollment;
import utez.edu.mx.eduhub.modules.repositories.CourseRepository;
import utez.edu.mx.eduhub.modules.repositories.UserRepository;
import utez.edu.mx.eduhub.modules.repositories.course.SessionRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class
CourseService {

    @Autowired
    private CourseRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    // OBTENER TODOS LOS CURSOS
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    // OBTENER CURSO POR ID
    public ResponseEntity<?> findById(String id) {
        Optional<Course> existingCourse = repository.findById(id);
        if (existingCourse.isPresent()) {
            Course course = existingCourse.get();
            List<Session> sessions = sessionRepository.findByCourseId(course.getId());
            course.setSessions(sessions);
            return ResponseEntity.ok(course);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }
    }

    // OBTENER CURSO POR ID DE DOCENTE
    public ResponseEntity<?> findByInstructorId(String docenteId) {
        List<Course> courses = repository.findByDocenteId(docenteId);
        return ResponseEntity.ok(courses);
    }

    // OBTENER ESTUDIANTES EN UN CURSO
    public ResponseEntity<?> getStudentsByCourse(String courseId) {
        Optional<Course> optionalCourse = repository.findById(courseId);

        if (optionalCourse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }

        Course course = optionalCourse.get();
        List<StudentEnrollment> enrollments = course.getEnrollments();

        if (enrollments.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Map<String, Object>> students = enrollments.stream().map(enrollment -> {
            Optional<UserEntity> studentOpt = userRepository.findById(enrollment.getStudentId());
            if (studentOpt.isPresent()) {
                UserEntity student = studentOpt.get();
                Map<String, Object> studentData = new HashMap<>();
                studentData.put("id", student.getId());
                studentData.put("name", student.getName());
                studentData.put("surname", student.getSurname());
                studentData.put("status", enrollment.getStatus());
                studentData.put("progress", enrollment.calculateProgress(course.getSessions().size()));
                return studentData;
            }
            return null;
        }).filter(Objects::nonNull).collect(Collectors.toList());

        return ResponseEntity.ok(students);
    }

    // SOLICITAR UNIRSE A UN CURSO
    public ResponseEntity<?> requestEnrollment(String courseId, String studentId) {
        Optional<Course> courseOpt = repository.findById(courseId);
        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();

            if (!course.getPublished() || !"Aprobado".equals(course.getStatus()) || new Date().after(course.getDateStart())) {
                return ResponseEntity.badRequest().body("El curso no está disponible para inscripciones.");
            }

            if (course.getEnrollments().size() >= course.getStudentsCount()) {
                return ResponseEntity.badRequest().body("El curso ya ha alcanzado el límite de estudiantes.");
            }

            boolean alreadyEnrolled = course.getEnrollments().stream()
                    .anyMatch(e -> e.getStudentId().equals(studentId));

            if (alreadyEnrolled) {
                return ResponseEntity.badRequest().body("Ya has solicitado la inscripción en este curso.");
            }

            String enrollmentStatus = course.getPrice() == 0 ? "Aceptado" : "Pendiente";
            course.getEnrollments().add(new StudentEnrollment(studentId, enrollmentStatus));

            repository.save(course);
            return ResponseEntity.ok(enrollmentStatus.equals("Aceptado") ? "Inscripción completada." : "Solicitud enviada.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");
    }

    // GESTIONAR SOLICITUD DE INSCRIPCIÓN
    public ResponseEntity<?> manageEnrollment(String courseId, String studentId, boolean accept, String adminId) {
        Optional<Course> courseOpt = repository.findById(courseId);
        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();

            // Validación de permisos: Solo el ADMIN puede gestionar inscripciones
            Optional<UserEntity> adminOpt = userRepository.findById(adminId);
            if (adminOpt.isEmpty() || !adminOpt.get().getRole().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permisos para gestionar inscripciones.");
            }

            for (StudentEnrollment enrollment : course.getEnrollments()) {
                if (enrollment.getStudentId().equals(studentId)) {
                    enrollment.setStatus(accept ? "Aceptado" : "Rechazado");
                    repository.save(course);
                    return ResponseEntity.ok("Estado actualizado.");
                }
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Estudiante no encontrado.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");
    }

    // COMPLETAR SESIONES DEL ESTUDIANTE
    public ResponseEntity<?> completeSession(String courseId, String studentId, String sessionId) {
        Optional<Course> courseOpt = repository.findById(courseId);
        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();

            List<Session> sessions = sessionRepository.findByCourseId(courseId);
            course.setSessions(sessions);

            for (StudentEnrollment enrollment : course.getEnrollments()) {
                if (enrollment.getStudentId().equals(studentId) && enrollment.getStatus().equals("Aceptado") || enrollment.getStatus().equals("En progreso")) {
                    if (!enrollment.getCompletedSessions().contains(sessionId)) {
                        enrollment.getCompletedSessions().add(sessionId);
                    }

                    int totalSessions = course.getSessions().size();
                    int completedSessions = enrollment.getCompletedSessions().size();
                    int progress = totalSessions > 0 ? (completedSessions * 100) / totalSessions : 0;

                    String status = progress >= 80 ? "Completado" : "En progreso";
                    enrollment.setStatus(status);

                    repository.save(course);
                    return ResponseEntity.ok("Progreso actualizado: " + progress + "% - Estado: " + status);
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No tienes acceso a este curso.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");
    }

    // CREAR UN CURSO
    public ResponseEntity<?> save(Course course) {
        try {
            if (course.getDateEnd().before(course.getDateStart())) {
                return ResponseEntity.badRequest().body("La fecha de fin no puede ser menor a la de inicio");
            }
            course.setArchived(false);
            course.setPublished(false);
            course.setStatus("Creado");

            repository.save(course);
            return ResponseEntity.ok("Curso registrado exitosamente.");
        } catch (Exception e) {
            System.out.println("Error al guardar el curso: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el curso.");
        }
    }

    // SOLICITAR APROBACIÓN DE UN CURSO
    public ResponseEntity<?> publishCourse(String courseId, String instructorId) {
        Optional<Course> optionalCourse = repository.findById(courseId);

        if (optionalCourse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }

        Course course = optionalCourse.get();

        if (!course.getDocenteId().equals(instructorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permisos para publicar este curso");
        }

        if (course.getPublished()) {
            return ResponseEntity.badRequest().body("El curso ya está publicado");
        }

        course.setStatus("Pendiente");
        course.setPublished(true);
        repository.save(course);

        return ResponseEntity.ok(course);
    }

    // APROBAR O RECHAZAR UN CURSO POR PARTE DE UN ADMINISTRADOR
    public ResponseEntity<?> approveCourse(String courseId, boolean approve, String adminId) {
        Optional<Course> optionalCourse = repository.findById(courseId);

        if (optionalCourse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }

        if (!optionalCourse.orElseThrow().getPublished()) {
            return ResponseEntity.badRequest().body("El curso no está publicado");
        }

        Course course = optionalCourse.get();

        if (approve) {
            course.setStatus("Aprobado");
            course.setPublished(true);
        } else {
            course.setStatus("Rechazado");
            course.setPublished(false);
        }

        repository.save(course);
        return ResponseEntity.ok("Curso " + (approve ? "aprobado" : "rechazado") + " correctamente.");
    }

    // SOLICITAR MODIFICACIONES PARA EL CURSO
    public ResponseEntity<?> requestModification(String courseId, String instructorId) {
        Optional<Course> optionalCourse = repository.findById(courseId);

        if (optionalCourse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }

        Course course = optionalCourse.get();

        if (!course.getDocenteId().equals(instructorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permisos para modificar este curso");
        }

        // **Evitar modificación si el curso ya fue aprobado**
        if ("Aprobado".equals(course.getStatus())) {
            return ResponseEntity.badRequest().body("No se pueden solicitar modificaciones en un curso aprobado.");
        }

        Date today = new Date();
        if (today.after(course.getDateStart())) {
            return ResponseEntity.badRequest().body("No puedes modificar el curso después de su inicio.");
        }

        course.setStatus("Creado");
        course.setPublished(false);
        repository.save(course);

        return ResponseEntity.ok("Curso ahora está en estado 'Creado' y puede modificarse nuevamente.");
    }

    // ACTUALIZAR CURSO
    public ResponseEntity<?> update(Course course) {
        Optional<Course> existingCourseOptional = repository.findById(course.getId());
        if (existingCourseOptional.isPresent()) {
            Course existingCourse = existingCourseOptional.get();

            if (new Date().after(existingCourse.getDateStart())) {
                return ResponseEntity.badRequest().body("No se pueden hacer cambios, el curso ya ha comenzado.");
            }

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

    // ELIMINAR CURSO
    public ResponseEntity<?> deleteById(String id) {
        Optional<Course> existingCourse = repository.findById(id);
        if (existingCourse.isPresent()) {
            try {
                sessionRepository.deleteByCourseId(id);

                repository.deleteById(id);
                return ResponseEntity.ok("Curso eliminado exitosamente junto con sus sesiones.");
            } catch (Exception e) {
                System.out.println("Error al eliminar el curso: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el curso");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }
    }

    public ResponseEntity<?> addRating(String courseId, Rating rating, String studentId) {
        Optional<Course> optionalCourse = repository.findById(courseId);

        if (optionalCourse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado");
        }

        Course course = optionalCourse.get();

        /* Validar si el curso ya finalizó
        if (new Date().before(course.getDateEnd())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El curso aún no ha finalizado.");
        }*/

        boolean isEnrolled = course.getEnrollments().stream()
                .anyMatch(enrollment -> enrollment.getStudentId().equals(studentId));

        if (!isEnrolled) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No estás inscrito en este curso.");
        }

        boolean alreadyRated = course.getRatings().stream()
                .anyMatch(existingRating -> existingRating.getStudentId().equals(studentId));

        if (alreadyRated) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya calificaste este curso.");
        }

        rating.setStudentId(studentId);
        course.getRatings().add(rating);
        repository.save(course);

        return ResponseEntity.ok("Calificación agregada correctamente.");
    }

}
