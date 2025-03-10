package utez.edu.mx.eduhub.modules.entities.course;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    @NotBlank(message = "Título requerido")
    private String title;
    private String description;
    private double price;
    private Date dateStart;
    private Date dateEnd;
    private Boolean isArchived; //Acciones del Admin
    private Boolean isPublished; //Acciones del Admin
    private String status; //pendiente, aceptado y rechazado

    //RELACIONES
    private String docenteId; //Referencia al Docente creador del curso
    private List<String> studentsEnrolled; //Referencia: studentId
    private List<Sesion> sessions; //Embebido: OneToMany
    private List<Rating> ratings; //Embebido: OneToMany

    public Course() {}

    public Course(String id, String title, String description, Date dateStart, Date dateEnd, Boolean isArchived, Boolean isPublished, String status, String docenteId, List<String> studentsEnrolled, List<Sesion> sessions, List<Rating> ratings) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.isArchived = isArchived;
        this.isPublished = isPublished;
        this.status = status;
        this.docenteId = docenteId;
        this.studentsEnrolled = studentsEnrolled;
        this.sessions = sessions;
        this.ratings = ratings;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NotBlank(message = "Título requerido") String getTitle() {
        return title;
    }

    public void setTitle(@NotBlank(message = "Título requerido") String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDateStart() {
        return dateStart;
    }

    public void setDateStart(Date dateStart) {
        this.dateStart = dateStart;
    }

    public Date getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(Date dateEnd) {
        this.dateEnd = dateEnd;
    }

    public Boolean getArchived() {
        return isArchived;
    }

    public void setArchived(Boolean archived) {
        isArchived = archived;
    }

    public Boolean getPublished() {
        return isPublished;
    }

    public void setPublished(Boolean published) {
        isPublished = published;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDocenteId() {
        return docenteId;
    }

    public void setDocenteId(String docenteId) {
        this.docenteId = docenteId;
    }

    public List<String> getStudentsEnrolled() {
        return studentsEnrolled;
    }

    public void setStudentsEnrolled(List<String> studentsEnrolled) {
        this.studentsEnrolled = studentsEnrolled;
    }

    public List<Sesion> getSessions() {
        return sessions;
    }

    public void setSessions(List<Sesion> sessions) {
        this.sessions = sessions;
    }

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }
}
