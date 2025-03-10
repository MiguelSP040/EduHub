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
    private String nameSesion;

    @NotBlank(message = "Ingrese una fecha de inicio para la sesión")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateStartSesion;

    @NotBlank(message = "Ingrese una fecha de fin para la sesión")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateEndSesion;

    //Relaciones
    private List<Chapter> chapter; //Embebido: OneToMany

    public Session() {}

    public Session(String id, String nameSesion, Date dateStartSesion, Date dateEndSesion, List<Chapter> chapter) {
        this.id = id;
        this.nameSesion = nameSesion;
        this.dateStartSesion = dateStartSesion;
        this.dateEndSesion = dateEndSesion;
        this.chapter = chapter;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNameSesion() {
        return nameSesion;
    }

    public void setNameSesion(String nameSesion) {
        this.nameSesion = nameSesion;
    }

    public Date getDateStartSesion() {
        return dateStartSesion;
    }

    public void setDateStartSesion(Date dateStartSesion) {
        this.dateStartSesion = dateStartSesion;
    }

    public Date getDateEndSesion() {
        return dateEndSesion;
    }

    public void setDateEndSesion(Date dateEndSesion) {
        this.dateEndSesion = dateEndSesion;
    }

    public List<Chapter> getChapter() {
        return chapter;
    }

    public void setChapter(List<Chapter> chapter) {
        this.chapter = chapter;
    }
}
