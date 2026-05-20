package com.file.expense_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ExpenseRequestDTO {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotNull(message = "Amount is required")
    private Double amount;
    
    private LocalDate date;
    private String recipient;
    private String location;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
