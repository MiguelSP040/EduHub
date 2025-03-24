package utez.edu.mx.eduhub.modules.entities.course;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "sessions")
public class Session {

    @Id
    private String id;

    private String courseId;

    @NotBlank(message = "Ingrese un nombre para la sesión")
    private String nameSession;

    private List<MultimediaFile> multimedia = new ArrayList<>();

    @NotBlank(message = "El contenido de la sesión es obligatoria")
    private String content; 

    public Session() {}

    public Session(String id, String courseId,
            @NotBlank(message = "Ingrese un nombre para la sesión") String nameSession, List<MultimediaFile> multimedia,
            @NotBlank(message = "El contenido de la sesión es obligatoria") String content) {
        this.id = id;
        this.courseId = courseId;
        this.nameSession = nameSession;
        this.multimedia = multimedia;
        this.content = content;
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

    public @NotBlank(message = "Ingrese un nombre para la sesión") String getNameSession() {
        return nameSession;
    }

    public void setNameSession(@NotBlank(message = "Ingrese un nombre para la sesión") String nameSession) {
        this.nameSession = nameSession;
    }

    public @NotBlank(message = "El contenido de la sesión es obligatoria") String getContent() {
        return content;
    }

    public void setContent(@NotBlank(message = "El contenido de la sesión es obligatoria") String content) {
        this.content = content;
    }

    public List<MultimediaFile> getMultimedia() {
        return multimedia;
    }

    public void setMultimedia(List<MultimediaFile> multimedia) {
        this.multimedia = multimedia;
    }
}
