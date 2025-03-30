package utez.edu.mx.eduhub.modules.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection= "payments")
public class TeacherPayment {

    @Id
    private String id;
    private String courseId;
    private String teacherId;
    private Double amount;
    private Date payDate;

    public TeacherPayment() {
    }

    public TeacherPayment(String id, String courseId, String teacherId, Double amount, Date payDate) {
        this.id = id;
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.amount = amount;
        this.payDate = payDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getPayDate() {
        return payDate;
    }

    public void setPayDate(Date payDate) {
        this.payDate = payDate;
    }
}
