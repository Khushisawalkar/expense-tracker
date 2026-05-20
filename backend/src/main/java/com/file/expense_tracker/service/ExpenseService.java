package com.file.expense_tracker.service;

import com.file.expense_tracker.dto.ExpenseEvent;
import com.file.expense_tracker.dto.ExpenseRequestDTO;
import com.file.expense_tracker.dto.ExpenseResponseDTO;
import com.file.expense_tracker.model.Expense;
import com.file.expense_tracker.model.User;
import com.file.expense_tracker.repository.ExpenseRepository;
import com.file.expense_tracker.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository repo;
    private final UserRepository userRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public ExpenseService(ExpenseRepository repo, UserRepository userRepo, SimpMessagingTemplate messagingTemplate) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.messagingTemplate = messagingTemplate;
    }

    public List<ExpenseResponseDTO> getAllByUser(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        return repo.findByUserId(user.getId()).stream()
                .map(ExpenseResponseDTO::new)
                .collect(Collectors.toList());
    }

    public ExpenseResponseDTO save(ExpenseRequestDTO dto, String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        Expense e = new Expense();
        e.setTitle(dto.getTitle());
        e.setCategory(dto.getCategory());
        e.setAmount(dto.getAmount());
        e.setDate(dto.getDate());
        e.setRecipient(dto.getRecipient());
        e.setLocation(dto.getLocation());
        e.setUser(user);
        
        Expense saved = repo.save(e);
        ExpenseResponseDTO response = new ExpenseResponseDTO(saved);
        
        messagingTemplate.convertAndSendToUser(username, "/queue/expenses", new ExpenseEvent("ADD", response));
        
        return response;
    }

    public ExpenseResponseDTO update(Long id, ExpenseRequestDTO dto, String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        Expense existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        existing.setTitle(dto.getTitle());
        existing.setCategory(dto.getCategory());
        existing.setAmount(dto.getAmount());
        existing.setDate(dto.getDate());
        existing.setRecipient(dto.getRecipient());
        existing.setLocation(dto.getLocation());
        
        Expense saved = repo.save(existing);
        ExpenseResponseDTO response = new ExpenseResponseDTO(saved);
        
        messagingTemplate.convertAndSendToUser(username, "/queue/expenses", new ExpenseEvent("UPDATE", response));
        
        return response;
    }

    public void delete(Long id, String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        Expense existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        repo.deleteById(id);
        messagingTemplate.convertAndSendToUser(username, "/queue/expenses", new ExpenseEvent("DELETE", id));
    }
}