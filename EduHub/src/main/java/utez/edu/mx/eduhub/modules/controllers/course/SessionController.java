package utez.edu.mx.eduhub.modules.controllers.course;

import utez.edu.mx.eduhub.modules.services.course.SessionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import utez.edu.mx.eduhub.modules.entities.course.Session;

@RestController
@RequestMapping("/eduhub/api/session")
public class SessionController {
    @Autowired 
    private SessionService sessionService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return sessionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return sessionService.findById(id);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Session session) {
        return sessionService.save(session);
    }

    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Session session) {
        return sessionService.update(session);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id) {
        return sessionService.deleteById(id);
    }
}
