package com.dairyxpress.controller;

import com.dairyxpress.dto.CreatePaymentRequest;
import com.dairyxpress.dto.PaymentResponse;
import com.dairyxpress.dto.VerifyPaymentRequest;
import com.dairyxpress.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create Razorpay Order
    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestBody CreatePaymentRequest request) throws Exception {

        PaymentResponse response = paymentService.createOrder(request);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test")
    public String test() {
        return "Payment Controller Working";
    }

    // Verify Payment
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody VerifyPaymentRequest request) throws Exception {

        boolean verified = paymentService.verifyPayment(request);

        if (verified) {
            return ResponseEntity.ok("Payment Verified Successfully");
        } else {
            return ResponseEntity.badRequest().body("Payment Verification Failed");
        }
    }

}