package utez.edu.mx.eduhub.modules.entities.course;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Document(collection = "courses")
public class Course {
    
    @Id
    private String id;

    @NotBlank(message = "Ingrese un título para el curso")
    private String title;

    @NotBlank(message = "Ingrese una descripción para el curso")
    private String description;

    @NotBlank(message = "Ingrese una fecha de inicio para el curso")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateStart;

    @NotBlank(message = "Ingrese una fecha de fin para el curso")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateEnd;

    //Acciones del ROLE_ADMIN
    private Boolean isArchived; 
    private Boolean isPublished; 
    private String status; //pendiente, aceptado o rechazado

    //Relaciones
    private String docenteId; //Referencia al Docente creador del curso
    private List<String> studentsEnrolled; //Referencia: studentId
    private List<Session> sessions; //Embebido: OneToMany
    private List<Rating> ratings; //Embebido: OneToMany

    public Course() {}

    public Course(String id, String title, String description, Date dateStart, Date dateEnd, Boolean isArchived, Boolean isPublished, String status, String docenteId, List<String> studentsEnrolled, List<Session> sessions, List<Rating> ratings) {
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

    public Boolean getIsArchived() {
        return isArchived;
    }

    public void setIsArchived(Boolean isArchived) {
        this.isArchived = isArchived;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
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

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }
}
