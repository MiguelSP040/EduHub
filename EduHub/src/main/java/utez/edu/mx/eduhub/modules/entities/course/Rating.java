package utez.edu.mx.eduhub.modules.entities.course;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Rating {
    private String studentId; //Referencia
    private int rating; //Estrellas del 1 al 5
    private String comment;

    public Rating() {}

    public Rating(String studentId, int rating, String comment) {
        this.studentId = studentId;
        this.rating = rating;
        this.comment = comment;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
