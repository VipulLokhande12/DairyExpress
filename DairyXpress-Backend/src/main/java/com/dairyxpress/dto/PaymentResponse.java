package com.dairyxpress.dto;

public class PaymentResponse {

    private String orderId;
    private String key;
    private Integer amount;
    private String currency;

    public PaymentResponse() {
    }

    public PaymentResponse(String orderId, String key, Integer amount, String currency) {
        this.orderId = orderId;
        this.key = key;
        this.amount = amount;
        this.currency = currency;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}