package com.file.expense_tracker.controller;

import com.file.expense_tracker.dto.ExpenseRequestDTO;
import com.file.expense_tracker.dto.ExpenseResponseDTO;
import com.file.expense_tracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public List<ExpenseResponseDTO> getAll() {
        String username = getUsername();
        return service.getAllByUser(username);
    }

    @PostMapping
    public ExpenseResponseDTO add(@Valid @RequestBody ExpenseRequestDTO dto) {
        String username = getUsername();
        return service.save(dto, username);
    }

    @PutMapping("/{id}")
    public ExpenseResponseDTO update(@PathVariable Long id, @Valid @RequestBody ExpenseRequestDTO dto) {
        String username = getUsername();
        return service.update(id, dto, username);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        String username = getUsername();
        service.delete(id, username);
    }

    private String getUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
}