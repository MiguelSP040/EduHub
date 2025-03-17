package utez.edu.mx.eduhub.modules.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.eduhub.modules.entities.UserEntity;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {

    // Buscar usuario por nombre de usuario
    Optional<UserEntity> findByUsername(String username);

    // Buscar usuario por email
    Optional<UserEntity> findByEmail(String email);

    // Buscar usuario por email o nombre de usuario (Para login)
    Optional<UserEntity> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
