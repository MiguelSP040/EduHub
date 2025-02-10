package utez.edu.mx.eduhub.modules.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.eduhub.modules.entities.UserEntity;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {
    /* Añadir aquí las queries que se vayan a utilizar */
}
