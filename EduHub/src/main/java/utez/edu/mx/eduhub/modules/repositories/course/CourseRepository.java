package utez.edu.mx.eduhub.modules.repositories.course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.eduhub.modules.entities.course.Course;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
}
