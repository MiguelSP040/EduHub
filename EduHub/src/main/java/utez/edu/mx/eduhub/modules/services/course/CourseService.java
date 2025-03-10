package utez.edu.mx.eduhub.modules.services.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.repositories.course.CourseRepository;
import utez.edu.mx.eduhub.utils.exceptions.NotFoundException;
import org.springframework.http.ResponseEntity;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public ResponseEntity<?> findAll(){
        return ResponseEntity.ok(courseRepository.findAll());
    }

    public ResponseEntity<?> findById(String id){
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Curso no encontrado con ID: " + id));
        return ResponseEntity.ok(existingCourse);
    }

    public ResponseEntity<?> save(Course course){
        try {
            courseRepository.save(course);
            return ResponseEntity.ok("Curso guardado exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al guardar el curso");
        }
    }

    public ResponseEntity<?> update(Course course){
        Course currentCourse = courseRepository.findById(course.getId())
                .orElseThrow(() -> new NotFoundException("Curso no encontrado con ID: " + course.getId()));
        currentCourse.setTitle(null != course.getTitle() ? course.getTitle() : currentCourse.getTitle());
        currentCourse.setDescription(null != course.getDescription() ? course.getDescription() : currentCourse.getDescription());
        currentCourse.setDateStart(null != course.getDateStart() ? course.getDateStart() : currentCourse.getDateStart());
        currentCourse.setDateEnd(null != course.getDateEnd() ? course.getDateEnd() : currentCourse.getDateEnd());
        currentCourse.setIsArchived(course.getIsArchived());
        currentCourse.setIsPublished(course.getIsPublished());
        currentCourse.setStatus(currentCourse.getStatus());
        try {
            courseRepository.save(currentCourse);
            return ResponseEntity.ok("Curso actualizado exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al actualizar el curso");
        }
    }

    public ResponseEntity<?> deleteById(String id){
        courseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Curso no encontrado con ID: " + id));
        try {
            courseRepository.deleteById(id);
            return ResponseEntity.ok("Curso eliminado exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error al eliminar el curso");
        }
    }
}