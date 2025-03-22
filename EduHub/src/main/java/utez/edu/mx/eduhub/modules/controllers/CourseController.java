package utez.edu.mx.eduhub.modules.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.entities.course.Rating;
import utez.edu.mx.eduhub.modules.services.CourseService;
import utez.edu.mx.eduhub.utils.security.JWTUtil;
import utez.edu.mx.eduhub.utils.security.UserDetailsImpl;

@RestController
@RequestMapping("/eduhub/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private JWTUtil jwtUtil;

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
    public ResponseEntity<?> manageEnrollment(@PathVariable String courseId, @PathVariable String studentId, @PathVariable boolean accept, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return courseService.manageEnrollment(courseId, studentId, accept, userDetails.getId());
    }

    @PutMapping("/{courseId}/complete-session/{studentId}/{sessionId}")
    public ResponseEntity<?> completeSession(@PathVariable String courseId, @PathVariable String studentId, @PathVariable String sessionId) {
        return courseService.completeSession(courseId, studentId, sessionId);
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        return courseService.save(course);
    }

    @PutMapping("/{courseId}/publish")
    public ResponseEntity<?> publishCourse(@PathVariable String courseId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return courseService.publishCourse(courseId, userDetails.getId());
    }

    @PutMapping("/{courseId}/approve")
    public ResponseEntity<?> approveCourse(@PathVariable String courseId, @RequestParam boolean approve, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return courseService.approveCourse(courseId, approve, userDetails.getId());
    }

    @PutMapping("/{courseId}/modify")
    public ResponseEntity<?> requestModification(@PathVariable String courseId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return courseService.requestModification(courseId, userDetails.getId());
    }

    @PutMapping
    public ResponseEntity<?> updateCourse(@RequestBody Course course) {
        return courseService.update(course);
    }

    @PostMapping("/{courseId}/rate")
    public ResponseEntity<?> rateCourse(@PathVariable String courseId, @RequestBody Rating rating, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return courseService.addRating(courseId, rating, userDetails.getId());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable String id) {
        return courseService.deleteById(id);
    }
}
