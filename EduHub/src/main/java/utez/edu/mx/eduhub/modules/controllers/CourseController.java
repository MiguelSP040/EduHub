package utez.edu.mx.eduhub.modules.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.services.CourseService;

@RestController
@RequestMapping("/eduhub/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<?> getAllCourses() {
        return courseService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable String id) {
        return courseService.findById(id);
    }

    @GetMapping("/instructor/{docenteId}")
    public ResponseEntity<?> getCoursesByInstructor(@PathVariable String docenteId) {
        return courseService.findByInstructorId(docenteId);
    }

    @GetMapping("/{courseId}/students")
    public ResponseEntity<?> getStudents(@PathVariable String courseId) {
        return courseService.getStudentsByCourse(courseId);
    }

    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<?> requestEnrollment(@PathVariable String courseId, @PathVariable String studentId) {
        return courseService.requestEnrollment(courseId, studentId);
    }

    @PutMapping("/{courseId}/manage-enrollment/{studentId}/{accept}")
    public ResponseEntity<?> manageEnrollment(@PathVariable String courseId, @PathVariable String studentId, @PathVariable boolean accept) {
        return courseService.manageEnrollment(courseId, studentId, accept);
    }

    @PutMapping("/{courseId}/complete-session/{studentId}/{sessionId}")
    public ResponseEntity<?> completeSession(@PathVariable String courseId, @PathVariable String studentId, @PathVariable String sessionId) {
        return courseService.completeSession(courseId, studentId, sessionId);
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        return courseService.save(course);
    }

    @PutMapping
    public ResponseEntity<?> updateCourse(@RequestBody Course course) {
        return courseService.update(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable String id) {
        return courseService.deleteById(id);
    }
}
