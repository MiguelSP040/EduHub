package utez.edu.mx.eduhub.auth;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.eduhub.auth.DTO.AuthLoginDto;
import utez.edu.mx.eduhub.modules.entities.UserEntity;
import utez.edu.mx.eduhub.modules.repositories.UserRepository;
import utez.edu.mx.eduhub.utils.security.JWTUtil;
import utez.edu.mx.eduhub.utils.security.UserDetailsImpl;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LogManager.getLogger(AuthService.class);

    @Autowired
    private UserRepository repository;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public ResponseEntity<?> verifyPassword(AuthLoginDto authLoginDto) {
        Optional<UserEntity> optionalUser = repository.findByUsernameOrEmail(authLoginDto.getUser(), authLoginDto.getUser());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        UserEntity found = optionalUser.get();

        if (!passwordEncoder.matches(authLoginDto.getPassword(), found.getPassword())) {
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }

        return ResponseEntity.ok("Contraseña verificada correctamente");
    }

    @Transactional(readOnly = true)
    public boolean isEmailRegistered(String email) {
        return repository.findByEmail(email).isPresent();
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> login(AuthLoginDto authLoginDto) {
        Optional<UserEntity> optionalUser =
                repository.findByUsernameOrEmail(authLoginDto.getUser(), authLoginDto.getUser());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario o contraseña incorrectos");
        }

        UserEntity found = optionalUser.get();

        // Verificar la contraseña
        if (!passwordEncoder.matches(authLoginDto.getPassword(), found.getPassword())) {
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authLoginDto.getUser(), authLoginDto.getPassword())
            );

            // Generar el token
            UserDetails userDetails = new UserDetailsImpl(found);
            String jwt = jwtUtil.generateToken(userDetails);

            // Respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", Map.of(
                    "id", found.getId(),
                    "username", found.getUsername(),
                    "name", found.getName(),
                    "surname", found.getSurname(),
                    "lastname", found.getLastname(),
                    "email", found.getEmail(),
                    "role", found.getRole()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al iniciar sesión: " + e.getMessage());
            return ResponseEntity.status(500).body("Error interno del servidor al intentar autenticar");
        }
    }
}