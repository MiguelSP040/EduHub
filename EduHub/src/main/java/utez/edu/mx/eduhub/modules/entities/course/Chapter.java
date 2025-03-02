package utez.edu.mx.eduhub.modules.entities.course;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "chapters")
public class Chapter {
    @Id
    private String id;
    private String nameChapter;
    private String descriptionChapter;
    private List<String> multimedia;
    private String content; 

    public Chapter() {}

    public Chapter(String id, String nameChapter, String descriptionChapter, List<String> multimedia, String content) {
        this.id = id;
        this.nameChapter = nameChapter;
        this.descriptionChapter = descriptionChapter;
        this.multimedia = multimedia;
        this.content = content;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNameChapter() {
        return nameChapter;
    }

    public void setNameChapter(String nameChapter) {
        this.nameChapter = nameChapter;
    }

    public String getDescriptionChapter() {
        return descriptionChapter;
    }

    public void setDescriptionChapter(String descriptionChapter) {
        this.descriptionChapter = descriptionChapter;
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