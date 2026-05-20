package com.file.expense_tracker.dto;

public class ExpenseEvent {
    private String action; // ADD, UPDATE, DELETE
    private Object payload;

    public ExpenseEvent() {}

    public ExpenseEvent(String action, Object payload) {
        this.action = action;
        this.payload = payload;
    }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public Object getPayload() { return payload; }
    public void setPayload(Object payload) { this.payload = payload; }
}
