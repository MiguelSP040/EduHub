package utez.edu.mx.eduhub.modules.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.eduhub.modules.entities.UserEntity;
import utez.edu.mx.eduhub.modules.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/eduhub/api/user")
@Validated
public class UserController {

    @Autowired
    private UserService service;

    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<?> findAll() {
        return service.findAll();
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return service.findById(id);
    }

    // Guardar un nuevo usuario
    @PostMapping
    public ResponseEntity<?> save(@Valid @RequestBody UserEntity user) {
        return service.save(user);
    }

    // Actualizar un usuario existente
    @PutMapping
    public ResponseEntity<?> update(@Valid @RequestBody UserEntity user) {
        return service.update(user);
    }

    // Eliminar un usuario por ID (ID es recibido en el cuerpo)
    @DeleteMapping
    public ResponseEntity<?> deleteById(@Valid @RequestBody UserEntity user) {
        return service.deleteById(user);
    }
}
