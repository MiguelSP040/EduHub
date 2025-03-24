package utez.edu.mx.eduhub.modules.entities.course;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "multimediaFiles")
public class MultimediaFile {
    @Id
    private String id; 
    private String fileName;
    private String fileType;
    private byte[] data;
    
    public MultimediaFile() {
    }

    public MultimediaFile(String fileName, String fileType, byte[] data) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.data = data;
    }

    public MultimediaFile(String id, String fileName, String fileType, byte[] data) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.data = data;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    
}
