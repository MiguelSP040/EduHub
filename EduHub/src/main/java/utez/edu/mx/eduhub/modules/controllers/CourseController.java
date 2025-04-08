package utez.edu.mx.eduhub.modules.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.eduhub.modules.entities.UserEntity;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.entities.course.Rating;
import utez.edu.mx.eduhub.modules.entities.dto.CertificateData;
import utez.edu.mx.eduhub.modules.repositories.UserRepository;
import utez.edu.mx.eduhub.modules.services.CourseService;
import utez.edu.mx.eduhub.modules.services.MultimediaService;
import utez.edu.mx.eduhub.utils.security.JWTUtil;
import utez.edu.mx.eduhub.utils.security.UserDetailsImpl;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/eduhub/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MultimediaService multimediaService;

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

    @PostMapping(value = "/{courseId}/enroll/{studentId}", consumes = { "multipart/form-data" })
    public ResponseEntity<?> requestEnrollment(
            @PathVariable String courseId,
            @PathVariable String studentId,
            @RequestPart(value = "voucher", required = false) MultipartFile voucherFile) {
        return courseService.requestEnrollment(courseId, studentId, voucherFile);
    }

    @PutMapping("/{courseId}/manage-enrollment/{studentId}/{accept}")
    public ResponseEntity<?> manageEnrollment(@PathVariable String courseId, @PathVariable String studentId, @PathVariable boolean accept, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return courseService.manageEnrollment(courseId, studentId, accept, userDetails.getId());
    }

    @PutMapping("/{courseId}/complete-session/{studentId}/{sessionId}")
    public ResponseEntity<?> completeSession(@PathVariable String courseId, @PathVariable String studentId, @PathVariable String sessionId) {
        return courseService.completeSession(courseId, studentId, sessionId);
    }

    @PostMapping(value = "", consumes = {"multipart/form-data", "application/json"})
    public ResponseEntity<?> createCourse(
            @RequestPart("course") Course course,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage
    ) {
        return courseService.save(course, coverImage);
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

    @PutMapping(value = "", consumes = { "multipart/form-data" })
    public ResponseEntity<?> updateCourse(
            @RequestPart("course") Course course,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestHeader("Authorization") String token
    ) {
        String username = jwtUtil.extractUsername(token.substring(7));

        Optional<UserEntity> instructorOpt = userRepository.findByUsername(username);
        if (instructorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuario no encontrado.");
        }

        UserEntity instructorEntity = instructorOpt.get();
        String instructorId = instructorEntity.getId();

        return courseService.update(course, coverImage, instructorId);
    }

    @PutMapping("/{id}/archive")
    public ResponseEntity<?> archiveCourse(@PathVariable String id, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        Optional<UserEntity> instructorOpt = userRepository.findByUsername(username);
        if (instructorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuario no encontrado.");
        }
        return courseService.archiveCourse(id, instructorOpt.get().getId());
    }

    @PutMapping("/{id}/duplicate")
    public ResponseEntity<?> duplicateCourse(@PathVariable String id, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        Optional<UserEntity> instructorOpt = userRepository.findByUsername(username);
        if (instructorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuario no encontrado.");
        }
        return courseService.duplicateCourse(id, instructorOpt.get().getId());
    }


    @PostMapping("/{courseId}/rate")
    public ResponseEntity<?> rateCourse(@PathVariable String courseId, @RequestBody Rating rating, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return courseService.addRating(courseId, rating, userDetails.getId());
    }

    @PostMapping("/{courseId}/deliver-certificates")
    public ResponseEntity<?> deliverCertificates(
            @PathVariable String courseId,
            @RequestBody List<CertificateData> certificates) {
        return courseService.deliverCertificates(courseId, certificates);
    }

    @GetMapping("/view-file/{gridFsId}")
    public ResponseEntity<?> viewFile(@PathVariable String gridFsId) {
        return multimediaService.viewFile(gridFsId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable String id) {
        return courseService.deleteById(id);
    }

    //Get courses por estudiante
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getCoursesByStudent(@PathVariable String studentId) {
        return courseService.requestCourseStudent(studentId);
    }

    @PutMapping("/{courseId}/start")
    public ResponseEntity<?> startCourse(@PathVariable String courseId) {
        return courseService.startCourse(courseId);
    }

    @PutMapping("/{courseId}/finish")
    public ResponseEntity<?> finishCourse(@PathVariable String courseId) {
        return courseService.finishCourse(courseId);
    }

    @PutMapping("/{courseId}/reset")
    public ResponseEntity<?> resetCourseToApproved(@PathVariable String courseId) {
        return courseService.resetCourseToApproved(courseId);
    }

}
