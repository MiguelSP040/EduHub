package utez.edu.mx.eduhub.modules.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.services.CourseService;
import java.util.List;

@RestController
@RequestMapping("/eduhub/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<?> getAllCourses() {
        return ResponseEntity.ok(courseService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable String id) {
        return courseService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        return courseService.save(course);
    }

    // 🔹 Nuevo endpoint para obtener cursos de un instructor específico
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<?> getCoursesByInstructor(@PathVariable String instructorId) {
        List<Course> courses = courseService.findByInstructorId(instructorId);
        return ResponseEntity.ok(courses);
    }
}
