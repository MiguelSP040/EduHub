package utez.edu.mx.eduhub.modules.services.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.repositories.course.CourseRepository;

import java.util.List;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAll(){
        return courseRepository.findAll();
    }

    public Course getById(String id){
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + id));
    }

    public Course create(Course course){
        return courseRepository.save(course);
    }

    public Course update(Course course){
        Course currentCourse = courseRepository.findById(course.getId())
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + course.getId()));
        currentCourse.setTitle(null != course.getTitle() ? course.getTitle() : currentCourse.getTitle());
        currentCourse.setDescription(null != course.getDescription() ? course.getDescription() : currentCourse.getDescription());
        currentCourse.setDateStart(null != course.getDateStart() ? course.getDateStart() : currentCourse.getDateStart());
        currentCourse.setDateEnd(null != course.getDateEnd() ? course.getDateEnd() : currentCourse.getDateEnd());
        currentCourse.setIsArchived(null != course.getIsArchived() ? course.getIsArchived() : currentCourse.getIsArchived());
        currentCourse.setIsPublished(null != course.getIsPublished() ? course.getIsPublished() : currentCourse.getIsPublished());
        currentCourse.setStatus(null != course.getStatus() ? course.getStatus() : currentCourse.getStatus());
        return courseRepository.save(currentCourse);
    }

    public void delete(String id){
        courseRepository.deleteById(id);
    }
}