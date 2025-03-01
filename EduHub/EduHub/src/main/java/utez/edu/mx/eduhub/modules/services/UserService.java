package utez.edu.mx.eduhub.modules.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.UserEntity;
import utez.edu.mx.eduhub.modules.repositories.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    public ResponseEntity<?> findById(String id) {
        Optional<UserEntity> existingUser = repository.findById(id);
        if (existingUser.isPresent()) {
            return ResponseEntity.ok(existingUser.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    public ResponseEntity<?> save(UserEntity user) {
        try {
            repository.save(user);
            return ResponseEntity.ok("Usuario guardado exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al guardar el usuario");
        }
    }

    public ResponseEntity<?> update(UserEntity user) {
        Optional<UserEntity> existingUserOptional = repository.findById(user.getId());
        if (existingUserOptional.isPresent()) {
            UserEntity existingUser = existingUserOptional.get();
                existingUser.setName(user.getName());
                existingUser.setSurname(user.getSurname());
                existingUser.setLastname(user.getLastname());
                existingUser.setUsername(user.getUsername());
                existingUser.setEmail(user.getEmail());
                existingUser.setPassword(user.getPassword());
            try {
                repository.save(existingUser);
                return ResponseEntity.ok("Usuario actualizado exitosamente");
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al actualizar el usuario");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    public ResponseEntity<?> deleteById(UserEntity user) {

        Optional<UserEntity> existingUser = repository.findById(user.getId());
        if (existingUser.isPresent()) {
            try {
                repository.deleteById(user.getId());
                return ResponseEntity.ok("Usuario eliminado exitosamente");
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el usuario");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }


}
