package utez.edu.mx.eduhub.modules.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import utez.edu.mx.eduhub.modules.entities.course.MultimediaFile;
import utez.edu.mx.eduhub.modules.entities.course.StudentEnrollment;
import utez.edu.mx.eduhub.modules.services.MultimediaService;

@RestController
@RequestMapping("/eduhub/api/enrollment")
public class StudentPaymentController {
    @Autowired
    private MultimediaService multimediaService;

    @PostMapping(value = "/uploadPaymentProof", consumes = { "multipart/form-data" })
    public ResponseEntity<?> uploadPaymentProof(
            @RequestPart("enrollment") StudentEnrollment enrollment,
            @RequestPart("file") MultipartFile file) {
        try {
            MultimediaFile paymentProof = multimediaService.processPaymentProof(file);
            enrollment.setPaymentProof(paymentProof);
            enrollment.setStatus("Pendiente");
            // Aquí deberías guardar la inscripción en la base de datos
            return ResponseEntity.ok("Comprobante de pago subido exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar el comprobante de pago: " + e.getMessage());
        }
    }

    @PostMapping("/acceptPayment/{studentId}")
    public ResponseEntity<?> acceptPayment(@PathVariable String studentId) {
        // Aquí deberías buscar la inscripción en la base de datos por studentId
        StudentEnrollment enrollment = findEnrollmentByStudentId(studentId);
        if (enrollment != null) {
            enrollment.setStatus("Aceptado");
            // Aquí deberías guardar la inscripción actualizada en la base de datos
            return ResponseEntity.ok("Pago aceptado y estado actualizado a 'Aceptado'");
        } else {
            return ResponseEntity.status(404).body("Inscripción no encontrada");
        }
    }

    @PostMapping("/rejectPayment/{studentId}")
    public ResponseEntity<?> rejectPayment(@PathVariable String studentId) {
        // Aquí deberías buscar la inscripción en la base de datos por studentId
        StudentEnrollment enrollment = findEnrollmentByStudentId(studentId);
        if (enrollment != null) {
            enrollment.setStatus("Rechazado");
            // Aquí deberías guardar la inscripción actualizada en la base de datos
            return ResponseEntity.ok("Pago rechazado y estado actualizado a 'Rechazado'");
        } else {
            return ResponseEntity.status(404).body("Inscripción no encontrada");
        }
    }

    private StudentEnrollment findEnrollmentByStudentId(String studentId) {
        // Implementa la lógica para buscar la inscripción en la base de datos
        return null;
    }
}
