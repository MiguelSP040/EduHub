package utez.edu.mx.eduhub.modules.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.eduhub.modules.entities.TeacherPayment;

import java.util.List;

@Repository
public interface TeacherPaymentRepository extends MongoRepository <TeacherPayment, String>{

    List<TeacherPayment> findByCourseId(String courseId);
    List<TeacherPayment> findByTeacherId(String teacherId);
}
