package utez.edu.mx.eduhub.modules.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import utez.edu.mx.eduhub.modules.entities.course.TransactionType;

import java.util.Date;

@Document(collection = "finances")
public class Finance {
    @Id
    private String id;

    private String courseId;
    private String userId;
    private TransactionType transactionType; //ENUM de estados Ingresos, Egresos
    private double amount;
    private Date transactionDate;
    private String description;

    public Finance() {
    }

    public Finance(String id, String courseId, String userId, TransactionType transactionType, double amount, Date transactionDate, String description) {
        this.id = id;
        this.courseId = courseId;
        this.userId = userId;
        this.transactionType = transactionType;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.description = description;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
