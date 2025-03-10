package utez.edu.mx.eduhub.modules.controllers.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.eduhub.modules.entities.course.Chapter;
import utez.edu.mx.eduhub.modules.services.course.ChapterService;
import java.util.List;

@RestController
@RequestMapping("/chapters")
public class ChapterController {
    @Autowired
    private ChapterService chapterService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return chapterService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return chapterService.findById(id);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Chapter chapter) {
        return chapterService.save(chapter);
    }

    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Chapter chapter){
        return chapterService.update(chapter);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return chapterService.delete(id);
    }
}
