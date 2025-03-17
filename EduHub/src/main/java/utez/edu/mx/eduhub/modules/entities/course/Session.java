package utez.edu.mx.eduhub.modules.entities.course;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Date;
import java.util.List;

@Document(collection = "sessions")
public class Session {

    @Id
    private String id;

    @NotBlank(message = "Ingrese un nombre para la sesión")
    private String nameSession;

    @NotBlank(message = "Ingrese una fecha de inicio para la sesión")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateStartSession;

    @NotBlank(message = "Ingrese una fecha de fin para la sesión")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateEndSession;

    private List<String> multimedia;

    private String content; 

    public Session() {}

    public Session(String id, @NotBlank(message = "Ingrese un nombre para la sesión") String nameSession,
            @NotBlank(message = "Ingrese una fecha de inicio para la sesión") Date dateStartSession,
            @NotBlank(message = "Ingrese una fecha de fin para la sesión") Date dateEndSession, List<String> multimedia,
            String content) {
        this.id = id;
        this.nameSession = nameSession;
        this.dateStartSession = dateStartSession;
        this.dateEndSession = dateEndSession;
        this.multimedia = multimedia;
        this.content = content;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNameSession() {
        return nameSession;
    }

    public void setNameSession(String nameSession) {
        this.nameSession = nameSession;
    }

    public Date getDateStartSession() {
        return dateStartSession;
    }

    public void setDateStartSession(Date dateStartSession) {
        this.dateStartSession = dateStartSession;
    }

    public Date getDateEndSession() {
        return dateEndSession;
    }

    public void setDateEndSession(Date dateEndSession) {
        this.dateEndSession = dateEndSession;
    }

    public List<String> getMultimedia() {
        return multimedia;
    }

    public void setMultimedia(List<String> multimedia) {
        this.multimedia = multimedia;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
