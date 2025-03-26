package utez.edu.mx.eduhub.modules.entities.course;

import java.util.ArrayList;
import java.util.List;

public class StudentEnrollment {
    private String studentId;
    private String status; // "Pendiente", "Aceptado", "Rechazado"
    private List<String> completedSessions;
    private MultimediaFile paymentProof;

    public StudentEnrollment() {
    }

    public StudentEnrollment(MultimediaFile paymentProof) {
        this.paymentProof = paymentProof;
    }

    public StudentEnrollment(String studentId, String status) {
        this.studentId = studentId;
        this.status = status;
        this.completedSessions = new ArrayList<>();
    }

    public StudentEnrollment(String studentId, String status, List<String> completedSessions,
            MultimediaFile paymentProof) {
        this.studentId = studentId;
        this.status = status;
        this.completedSessions = completedSessions;
        this.paymentProof = paymentProof;
    }

    public int calculateProgress(int totalSessions) {
        if (totalSessions == 0) return 0;
        return (completedSessions.size() * 100) / totalSessions;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getCompletedSessions() {
        return completedSessions;
    }

    public void setCompletedSessions(List<String> completedSessions) {
        this.completedSessions = completedSessions;
    }

    public MultimediaFile getPaymentProof() {
        return paymentProof;
    }

    public void setPaymentProof(MultimediaFile paymentProof) {
        this.paymentProof = paymentProof;
    }
}
