package utez.edu.mx.eduhub.modules.entities.course;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.ArrayList;
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
    private double price;

    @NotBlank(message = "Ingrese una fecha de inicio para el curso")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateStart;

    @NotBlank(message = "Ingrese una fecha de fin para el curso")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateEnd;

    @NotBlank(message = "Ingrese una categoría para el curso")
    private String category;

    @NotBlank(message = "Ingrese una cantidad de estudiantes")
    private int studentsCount;

    @NotBlank(message = "Ingrese un horario para el curso")
    private String classTime;

    //Acciones del ROLE_ADMIN
    private Boolean isArchived;
    private Boolean isPublished;
    private String status; //pendiente, aceptado o rechazado

    //Relaciones
    private String docenteId; //Referencia al Docente creador del curso
    private List<StudentEnrollment> enrollments = new ArrayList<>();
    private List<Session> sessions; //Embebido: OneToMany
    private List<Rating> ratings; //Embebido: OneToMany

    public Course() {}

    public Course(String id, String title, String description, double price, Date dateStart, Date dateEnd, String category, int studentsCount, String classTime, Boolean isArchived, Boolean isPublished, String status, String docenteId, List<StudentEnrollment> enrollments, List<Session> sessions, List<Rating> ratings) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.category = category;
        this.studentsCount = studentsCount;
        this.classTime = classTime;
        this.isArchived = isArchived;
        this.isPublished = isPublished;
        this.status = status;
        this.docenteId = docenteId;
        this.enrollments = new ArrayList<>();
        this.sessions = sessions;
        this.ratings = ratings;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NotBlank(message = "Ingrese un título para el curso") String getTitle() {
        return title;
    }

    public void setTitle(@NotBlank(message = "Ingrese un título para el curso") String title) {
        this.title = title;
    }

    public @NotBlank(message = "Ingrese una descripción para el curso") String getDescription() {
        return description;
    }

    public void setDescription(@NotBlank(message = "Ingrese una descripción para el curso") String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public @NotBlank(message = "Ingrese una fecha de inicio para el curso") Date getDateStart() {
        return dateStart;
    }

    public void setDateStart(@NotBlank(message = "Ingrese una fecha de inicio para el curso") Date dateStart) {
        this.dateStart = dateStart;
    }

    public @NotBlank(message = "Ingrese una fecha de fin para el curso") Date getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(@NotBlank(message = "Ingrese una fecha de fin para el curso") Date dateEnd) {
        this.dateEnd = dateEnd;
    }

    public @NotBlank(message = "Ingrese una categoría para el curso") String getCategory() {
        return category;
    }

    public void setCategory(@NotBlank(message = "Ingrese una categoría para el curso") String category) {
        this.category = category;
    }

    @NotBlank(message = "Ingrese una cantidad de estudiantes")
    public int getStudentsCount() {
        return studentsCount;
    }

    public void setStudentsCount(@NotBlank(message = "Ingrese una cantidad de estudiantes") int studentsCount) {
        this.studentsCount = studentsCount;
    }

    public @NotBlank(message = "Ingrese un horario para el curso") String getClassTime() {
        return classTime;
    }

    public void setClassTime(@NotBlank(message = "Ingrese un horario para el curso") String classTime) {
        this.classTime = classTime;
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

    public List<StudentEnrollment> getEnrollments() {
        return enrollments == null ? new ArrayList<>() : enrollments;
    }

    public void setEnrollments(List<StudentEnrollment> enrollments) {
        this.enrollments = enrollments;
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
