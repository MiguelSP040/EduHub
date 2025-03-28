package utez.edu.mx.eduhub.modules.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.eduhub.modules.entities.Finance;
import utez.edu.mx.eduhub.modules.services.FinanceService;

@RestController
@RequestMapping("/eduhub/api/finances")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE })
@Validated
public class FinanceController {
    @Autowired
    private FinanceService service;

    @PostMapping
    public ResponseEntity<?> createFinance(@RequestBody Finance finance) {
        return service.createFinance(finance);
    }

    @GetMapping
    public ResponseEntity<?> getAllFinances() {
        return service.getAllFinances();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFinanceById(@PathVariable String id) {
        return service.getFinanceById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFinance(@PathVariable String id, @RequestBody Finance finance) {
        return service.updateFinance(id, finance);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFinance(@PathVariable String id) {
        return service.deleteFinance(id);
    }
}
