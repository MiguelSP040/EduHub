package utez.edu.mx.eduhub.modules.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import utez.edu.mx.eduhub.modules.entities.course.MultimediaFile;

@Service
public class MultimediaService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    public List<MultimediaFile> processFiles(MultipartFile[] files) throws Exception {
        List<MultimediaFile> multimediaFiles = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                ObjectId gridFsFileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
                MultimediaFile mf = new MultimediaFile();
                mf.setId(UUID.randomUUID().toString());
                mf.setFileName(file.getOriginalFilename());
                mf.setFileType(file.getContentType());
                mf.setGridFsId(gridFsFileId.toString());
                multimediaFiles.add(mf);
            }
        }
        return multimediaFiles;
    }
}
