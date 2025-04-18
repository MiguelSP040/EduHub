package utez.edu.mx.eduhub.modules.repositories.course;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import utez.edu.mx.eduhub.modules.entities.course.Session;

import java.util.List;

@Repository
public interface SessionRepository extends MongoRepository<Session, String> {
    List<Session> findByCourseId(String courseId);

    @Query(value = "{ 'courseId': ?0 }", delete = true)
    void deleteByCourseId(String courseId);
}
