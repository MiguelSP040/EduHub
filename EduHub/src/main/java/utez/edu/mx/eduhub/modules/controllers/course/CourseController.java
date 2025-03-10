package utez.edu.mx.eduhub.modules.controllers.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.services.course.CourseService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/eduhub/api/course")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping("")
    public ResponseEntity<?> findAll(){
        return courseService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id){
        return courseService.findById(id);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Course course){
        return courseService.save(course);
    }

    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Course course){
        return courseService.update(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id){
        return courseService.deleteById(id);
    }
}
