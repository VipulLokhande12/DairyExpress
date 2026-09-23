package com.dairyxpress.dto;

public class CreatePaymentRequest {

    private Double amount;

    public CreatePaymentRequest() {
    }

    public CreatePaymentRequest(Double amount) {
        this.amount = amount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}