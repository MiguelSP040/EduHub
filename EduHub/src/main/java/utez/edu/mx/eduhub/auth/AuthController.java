package utez.edu.mx.eduhub.auth;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.eduhub.auth.DTO.AuthLoginDto;

@RestController
@RequestMapping("/eduhub/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping
    public ResponseEntity<?> login(@Valid @RequestBody AuthLoginDto authLogin) {
        return ResponseEntity.ok(service.login(authLogin));
    }

}
