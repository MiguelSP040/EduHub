package utez.edu.mx.eduhub.auth;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.eduhub.auth.DTO.AuthLoginDto;
import utez.edu.mx.eduhub.auth.DTO.PasswordResetDto;
import utez.edu.mx.eduhub.auth.DTO.PasswordResetRequestDto;

@RestController
@RequestMapping("/eduhub/auth")
@CrossOrigin(origins = "*", methods = { RequestMethod.POST, RequestMethod.GET })
@Validated
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(@Valid @RequestBody AuthLoginDto authLoginDto) {
        return service.verifyPassword(authLoginDto);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> isEmailRegistered(@RequestParam String email) {
        boolean exists = service.isEmailRegistered(email);
        if (exists) {
            return ResponseEntity.status(409).body("El correo ya está registrado");
        }
        return ResponseEntity.ok("El correo está disponible");
    }

    @PostMapping
    public ResponseEntity<?> login(@Valid @RequestBody AuthLoginDto authLogin) {
        return ResponseEntity.ok(service.login(authLogin));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody PasswordResetRequestDto requestDto) {
        boolean emailSent = service.sendPasswordResetEmail(requestDto);
        if (!emailSent) {
            return ResponseEntity.status(404).body("Correo no registrado.");
        }
        return ResponseEntity.ok("Se ha enviado un correo de recuperación.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDto resetDto) {
        boolean passwordReset = service.resetPassword(resetDto);
        if (!passwordReset) {
            return ResponseEntity.status(400).body("Token inválido o expirado.");
        }
        return ResponseEntity.ok("Contraseña actualizada correctamente.");
    }
}
