package utez.edu.mx.eduhub.modules.entities.course;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "raitings")
public class Rating {
    @Id
    private String id;
    private int score; //Estrellas del 1 al 5
    private String comment;
    private String studentId; //Referencia

    public Rating() {}

    public Rating(String id, int score, String comment, String studentId) {
        this.id = id;
        this.score = score;
        this.comment = comment;
        this.studentId = studentId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
}
