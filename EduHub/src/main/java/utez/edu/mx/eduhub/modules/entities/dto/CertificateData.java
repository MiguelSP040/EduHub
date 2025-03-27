package utez.edu.mx.eduhub.modules.entities.dto;

public class CertificateData {
    private String studentId;
    private String base64;

    public CertificateData(String studentId, String base64) {
        this.studentId = studentId;
        this.base64 = base64;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getBase64() {
        return base64;
    }

    public void setBase64(String base64) {
        this.base64 = base64;
    }
}
