package utez.edu.mx.eduhub.modules.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import utez.edu.mx.eduhub.modules.entities.course.MultimediaFile;

@Service
public class MultimediaService {

    public List<MultimediaFile> processFiles(MultipartFile[] files) throws Exception {
        List<MultimediaFile> multimediaFiles = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                MultimediaFile mf = new MultimediaFile();
                mf.setId(UUID.randomUUID().toString());
                mf.setFileName(file.getOriginalFilename());
                mf.setFileType(file.getContentType());
                mf.setData(file.getBytes());
                multimediaFiles.add(mf);
            }
        }
        return multimediaFiles;
    }
}
