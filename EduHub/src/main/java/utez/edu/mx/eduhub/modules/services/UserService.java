package utez.edu.mx.eduhub.modules.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.UserEntity;
import utez.edu.mx.eduhub.modules.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
        if (repository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El nombre de usuario ya está en uso");
        }

        if (repository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo electrónico ya está en uso");
        }

        user.setActive(!"ROLE_INSTRUCTOR".equals(user.getRole()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        try {
            repository.save(user);

            // Notificar a los administradores si el usuario registrado es un instructor
            if ("ROLE_INSTRUCTOR".equals(user.getRole())) {
                List<UserEntity> admins = repository.findAllByRole("ROLE_ADMIN");
                for (UserEntity admin : admins) {
                    notificationService.sendNotification(
                            admin.getId(),
                            "Nuevo instructor registrado",
                            "El instructor \"" + user.getName() + " " + user.getSurname()
                                    + "\" se ha registrado en la plataforma. Revisa su postulación.",
                            "Alert",
                            "User",
                            user.getId());
                }
            }

            return ResponseEntity.ok("Usuario guardado exitosamente");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al guardar el usuario");
        }
    }

    public ResponseEntity<?> activateInstructor(String instructorId) {
        Optional<UserEntity> instructorOpt = repository.findById(instructorId);

        if (instructorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Instructor no encontrado.");
        }

        UserEntity instructor = instructorOpt.get();

        if (!"ROLE_INSTRUCTOR".equals(instructor.getRole())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El usuario no es un instructor.");
        }

        if (instructor.isActive()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El instructor ya está activado.");
        }

        instructor.setActive(true);
        repository.save(instructor);

        return ResponseEntity.ok("Instructor activado correctamente.");
    }

    public ResponseEntity<?> update(UserEntity user) {
        Optional<UserEntity> existingUserOptional = repository.findById(user.getId());
        if (existingUserOptional.isPresent()) {
            UserEntity existingUser = existingUserOptional.get();

            existingUser.setName(user.getName() != null ? user.getName() : existingUser.getName());
            existingUser.setSurname(user.getSurname() != null ? user.getSurname() : existingUser.getSurname());
            existingUser.setLastname(user.getLastname() != null ? user.getLastname() : existingUser.getLastname());
            existingUser.setUsername(user.getUsername() != null ? user.getUsername() : existingUser.getUsername());
            existingUser.setEmail(user.getEmail() != null ? user.getEmail() : existingUser.getEmail());
            existingUser.setDescription(
                    user.getDescription() != null ? user.getDescription() : existingUser.getDescription());
            existingUser.setActive(existingUser.isActive());
            existingUser.setProfileImage(
                    user.getProfileImage() != null ? user.getProfileImage() : existingUser.getProfileImage());

            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
            }

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
