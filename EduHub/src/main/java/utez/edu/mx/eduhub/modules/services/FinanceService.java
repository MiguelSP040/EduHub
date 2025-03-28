package utez.edu.mx.eduhub.modules.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.eduhub.modules.entities.Finance;
import utez.edu.mx.eduhub.modules.repositories.FinanceRepository;

import java.util.List;

@Service
public class FinanceService {
    @Autowired
    private FinanceRepository repository;

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
}
