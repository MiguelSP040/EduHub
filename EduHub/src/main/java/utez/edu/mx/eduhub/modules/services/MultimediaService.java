package utez.edu.mx.eduhub.modules.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.core.io.InputStreamResource;

import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import utez.edu.mx.eduhub.modules.entities.course.MultimediaFile;



@Service
public class MultimediaService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFsOperations gridFsOperations;

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

    public ResponseEntity<?> viewFile(String gridFsId) {
        try {
            GridFSFile file = gridFsTemplate.findOne(
                    Query.query(Criteria.where("_id").is(new ObjectId(gridFsId)))
            );

            if (file == null) {
                return ResponseEntity.status(404).body("Archivo no encontrado");
            }

            GridFsResource resource = gridFsOperations.getResource(file);
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.parseMediaType(resource.getContentType()))
                    .body(new InputStreamResource(resource.getInputStream()));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error al obtener archivo: " + e.getMessage());
        }
    }
}
