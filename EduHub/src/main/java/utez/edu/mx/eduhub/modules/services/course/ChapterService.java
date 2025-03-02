package utez.edu.mx.eduhub.modules.services.course;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.repositories.course.ChapterRepository;
import utez.edu.mx.eduhub.modules.entities.course.Chapter;

@Service
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;

    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    public Chapter findById(String id) {
        return chapterRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Capítulo no encontrado con ID: " + id));
    }
    
    public Chapter create(Chapter chapter) {
        return chapterRepository.save(chapter);
    }

    public Chapter update(Chapter chapter) {
        Chapter currenChapter = chapterRepository.findById(chapter.getId())
        .orElseThrow(() -> new RuntimeException("Capítulo no encontrado con ID: " + chapter.getId()));
        currenChapter.setNameChapter(null != chapter.getNameChapter() ? chapter.getNameChapter() : currenChapter.getNameChapter());
        currenChapter.setDescriptionChapter(null != chapter.getDescriptionChapter() ? chapter.getDescriptionChapter() : currenChapter.getDescriptionChapter());
        currenChapter.setMultimedia(null != chapter.getMultimedia() ? chapter.getMultimedia() : currenChapter.getMultimedia());
        return chapterRepository.save(currenChapter);
    }

    public void delete(String id) {
        chapterRepository.deleteById(id);
    }

}
