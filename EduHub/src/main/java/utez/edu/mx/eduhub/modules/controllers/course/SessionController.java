package utez.edu.mx.eduhub.modules.controllers.course;

import utez.edu.mx.eduhub.modules.services.MultimediaService;
import utez.edu.mx.eduhub.modules.services.course.SessionService;
import utez.edu.mx.eduhub.modules.entities.course.Session;
import utez.edu.mx.eduhub.modules.entities.course.MultimediaFile;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/eduhub/api/session")
public class SessionController {
    @Autowired
    private SessionService sessionService;

    @Autowired
    private MultimediaService multimediaService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return sessionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return sessionService.findById(id);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getSessionsByCourse(@PathVariable String courseId) {
        return sessionService.findByCourseId(courseId);
    }

    @PostMapping(value = "", consumes = { "multipart/form-data" })
    public ResponseEntity<?> save(
            @RequestPart("session") Session session,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {
        try {
            List<MultimediaFile> multimediaFiles = multimediaService.processFiles(files);
            session.setMultimedia(multimediaFiles);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar archivos: " + e.getMessage());
        }
        return sessionService.save(session);
    }

    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Session session) {
        return sessionService.update(session);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id) {
        return sessionService.deleteById(id);
    }

    @GetMapping("/{sessionId}/multimedia/{fileId}")
    public ResponseEntity<?> getMultimediaFile(@PathVariable String sessionId, @PathVariable String fileId) {
        Session session = (Session) sessionService.findById(sessionId).getBody();
        if (session != null) {
            for (MultimediaFile file : session.getMultimedia()) {
                if (file.getId().equals(fileId)) {
                    return ResponseEntity.ok()
                            .header("Content-Disposition", "attachment; filename=\"" + file.getFileName() + "\"")
                            .contentType(org.springframework.http.MediaType.parseMediaType(file.getFileType()))
                            .body(file.getData());
                }
            }
        }
        return ResponseEntity.status(404).body("Archivo no encontrado");
    }

    @DeleteMapping("/{sessionId}/multimedia/{fileId}")
    public ResponseEntity<?> removeFileFromSession(@PathVariable String sessionId, @PathVariable String fileId) {
        Session session = (Session) sessionService.findById(sessionId).getBody();
        if (session == null) {
            return ResponseEntity.status(404).body("Sesión no encontrada");
        }
    
        boolean removed = session.getMultimedia().removeIf(file -> file.getId().equals(fileId));
        if (!removed) {
            return ResponseEntity.status(404).body("Archivo no encontrado en la sesión");
        }
    
        sessionService.update(session);
        return ResponseEntity.ok("Archivo eliminado de la sesión");
    }

}