package utez.edu.mx.eduhub.modules.entities.course;

import java.util.ArrayList;
import java.util.List;

public class StudentEnrollment {
    private String studentId;
    private String status; // "Pendiente", "Aceptado", "Rechazado"
    private List<String> completedSessions;

    public StudentEnrollment(String studentId, String status) {
        this.studentId = studentId;
        this.status = status;
        this.completedSessions = new ArrayList<>();
    }

    public int calculateProgress(int totalSessions) {
        if (totalSessions == 0) return 0;
        return (completedSessions.size() * 100) / totalSessions;
    }

    // Getters y Setters

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
}
