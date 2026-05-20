package com.file.expense_tracker.dto;

import com.file.expense_tracker.model.Expense;
import java.time.LocalDate;

public class ExpenseResponseDTO {
    private Long id;
    private String title;
    private String category;
    private double amount;
    private LocalDate date;
    private String recipient;
    private String location;

    public ExpenseResponseDTO(Expense e) {
        this.id = e.getId();
        this.title = e.getTitle();
        this.category = e.getCategory();
        this.amount = e.getAmount();
        this.date = e.getDate();
        this.recipient = e.getRecipient();
        this.location = e.getLocation();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
