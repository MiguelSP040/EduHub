package utez.edu.mx.eduhub.modules.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import utez.edu.mx.eduhub.modules.entities.Finance;

import java.util.List;

public interface FinanceRepository  extends MongoRepository<Finance, String> {
    List<Finance> findByCourseId(String courseId);
}
