package utez.edu.mx.eduhub.modules.controllers.course;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.services.course.CourseService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/course")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping("")
    public List<Course> getAll(){
        return courseService.getAll();
    }
    
    @GetMapping("/{id}")
    public Course getById(@PathVariable String id){
        return courseService.getById(id);
    }

    @PostMapping("")
    public Course create(@RequestBody Course course){
        return courseService.create(course);
    }

    @PutMapping("")
    public Course update(@RequestBody Course course){
        return courseService.update(course);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){
        courseService.delete(id);
    }
}
