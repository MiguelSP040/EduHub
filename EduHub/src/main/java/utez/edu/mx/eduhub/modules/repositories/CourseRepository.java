package utez.edu.mx.eduhub.modules.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByDocenteId(String docenteId);
}
