package utez.edu.mx.eduhub.modules.controllers.course;

import utez.edu.mx.eduhub.modules.services.course.SesionService;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.eduhub.modules.entities.course.Sesion;

@RestController
@RequestMapping("/sesion")
public class SesionController {
    @Autowired 
    private SesionService sesionService;

    @GetMapping("")
    public List<Sesion> getAll() {
        return sesionService.getAll();
    }

    @GetMapping("/{id}")
    public Sesion getById(@PathVariable String id) {
        return sesionService.getById(id);
    }

    @PostMapping("")
    public Sesion create(@RequestBody Sesion sesion) {
        return sesionService.create(sesion);
    }

    @PutMapping("")
    public Sesion update(@RequestBody Sesion sesion) {
        return sesionService.update(sesion);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        sesionService.delete(id);
    }
}
