package utez.edu.mx.eduhub.modules.entities.course;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "sessions")
public class Sesion {
    @Id
    private String id;
    private String nameSesion;
    private Date dateStartSesion;
    private Date dateEndSesion;
    private List<Chapter> chapter; //Embebido: OneToMany

    public Sesion() {}

    public Sesion(String id, String nameSesion, Date dateStartSesion, Date dateEndSesion, List<Chapter> chapter) {
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
