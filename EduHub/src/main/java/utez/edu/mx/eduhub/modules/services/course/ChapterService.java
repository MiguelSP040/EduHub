package utez.edu.mx.eduhub.modules.services.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.repositories.course.ChapterRepository;
import utez.edu.mx.eduhub.utils.exceptions.NotFoundException;
import utez.edu.mx.eduhub.modules.entities.course.Chapter;
import org.springframework.http.ResponseEntity;

@Service
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;

    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(chapterRepository.findAll());
    }

    public ResponseEntity<?> findById(String id) {
        Chapter existingChapter = chapterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Capítulo no encontrado con ID: " + id));
        return ResponseEntity.ok(existingChapter);
    }

    public ResponseEntity<?> save(Chapter chapter) {
        try {
            chapterRepository.save(chapter);
            return ResponseEntity.ok("Capítulo guardado exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al guardar el capítulo");
        }
    }

    public ResponseEntity<?> update(Chapter chapter) {
        Chapter currenChapter = chapterRepository.findById(chapter.getId())
                .orElseThrow(() -> new NotFoundException("Capítulo no encontrado con ID: " + chapter.getId()));
        currenChapter.setNameChapter(
                null != chapter.getNameChapter() ? chapter.getNameChapter() : currenChapter.getNameChapter());
        currenChapter.setDescriptionChapter(null != chapter.getDescriptionChapter() ? chapter.getDescriptionChapter()
                : currenChapter.getDescriptionChapter());
        currenChapter.setMultimedia(currenChapter.getMultimedia());
        try {
            chapterRepository.save(currenChapter);
            return ResponseEntity.ok("Capítulo actualizado exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al actualizar el capítulo");
        }
    }

    public ResponseEntity<?> delete(String id) {
        Chapter existingChapter = chapterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Capítulo no encontrado con ID: " + id));
        try {
            chapterRepository.delete(existingChapter);
            return ResponseEntity.ok("Capítulo eliminado exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al eliminar el capítulo");
        }
    }

}
