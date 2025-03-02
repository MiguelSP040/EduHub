package utez.edu.mx.eduhub.modules.controllers.course;

import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Chapter> getAllChapters() {
        return chapterService.getAllChapters();
    }

    @GetMapping("/{id}")
    public Chapter findById(@PathVariable String id) {
        return chapterService.findById(id);
    }

    @PostMapping("")
    public Chapter create(@RequestBody Chapter chapter) {
        return chapterService.create(chapter);
    }

    @PutMapping("")
    public Chapter update(@RequestBody Chapter chapter){
        return chapterService.update(chapter);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        chapterService.delete(id);
    }
}
