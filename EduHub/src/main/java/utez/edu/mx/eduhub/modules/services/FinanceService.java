package utez.edu.mx.eduhub.modules.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.Finance;
import utez.edu.mx.eduhub.modules.entities.UserEntity;
import utez.edu.mx.eduhub.modules.entities.course.Course;
import utez.edu.mx.eduhub.modules.entities.course.TransactionType;
import utez.edu.mx.eduhub.modules.repositories.CourseRepository;
import utez.edu.mx.eduhub.modules.repositories.FinanceRepository;
import utez.edu.mx.eduhub.modules.repositories.UserRepository;

import java.util.Date;
import java.util.List;

@Service
public class FinanceService {
    @Autowired
    private FinanceRepository repository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public FinanceService(FinanceRepository repository) {
        this.repository = repository;
    }

    public ResponseEntity<?> createFinance(Finance finance){
        Finance savedFinance = repository.save(finance);
        return new ResponseEntity<>(savedFinance, HttpStatus.CREATED);
    }

    public ResponseEntity<?> getAllFinances(){
        List<Finance> finances = repository.findAll();
        return ResponseEntity.ok(finances);
    }

    public ResponseEntity<?> getFinanceById(String id){
        return repository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<?> updateFinance(String id, Finance financeDetails){
        Finance existingFinance = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró la transacción financiera con id: " + id));

        existingFinance.setCourseId(financeDetails.getCourseId());
        existingFinance.setUserId(financeDetails.getUserId());
        existingFinance.setTransactionType(financeDetails.getTransactionType());
        existingFinance.setAmount(financeDetails.getAmount());
        existingFinance.setTransactionDate(financeDetails.getTransactionDate());
        existingFinance.setDescription(financeDetails.getDescription());

        Finance updatedFinance = repository.save(existingFinance);
        return ResponseEntity.ok(updatedFinance);
    }

    public ResponseEntity<?> deleteFinance(String id){
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> payInstructorForCourse(String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("No se encontró el curso con id: " + courseId));

        if (course.isPaidToInstructor()) {
            return new ResponseEntity<>("Este curso ya fue pagado al instructor", HttpStatus.BAD_REQUEST);
        }


        UserEntity instructor = userRepository.findById(course.getInstructorId())
                .orElseThrow(() -> new RuntimeException("No se encontró el instructor con id: " + course.getInstructorId()));

        if (!"ROLE_INSTRUCTOR".equals(instructor.getRole())) {
            return new ResponseEntity<>("El usuario no tiene rol de INSTRUCTOR", HttpStatus.BAD_REQUEST);
        }

        // 3. Sumar todos los INCOME de Finance para ese curso
        List<Finance> incomes = repository.findByCourseIdAndTransactionType(courseId, TransactionType.INCOME);
        double totalIncome = incomes.stream().mapToDouble(Finance::getAmount).sum();


        if (totalIncome <= 0) {
            return new ResponseEntity<>("No hay ingresos para este curso", HttpStatus.BAD_REQUEST);
        }

        // 4. Registrar el EGRESO (pago al instructor)
        Finance expense = new Finance();
        expense.setCourseId(courseId);
        expense.setUserId(instructor.getId()); //rol=INSTRUCTOR
        expense.setTransactionType(TransactionType.EXPENSE);
        expense.setAmount(totalIncome);
        expense.setTransactionDate(new Date());
        expense.setDescription("Pago al instructor");
        repository.save(expense);

        course.setPaidToInstructor(true);
        courseRepository.save(course);

        return new ResponseEntity<>("Pago de " + totalIncome + " realizado al instructor con éxito", HttpStatus.OK);
    }
}
