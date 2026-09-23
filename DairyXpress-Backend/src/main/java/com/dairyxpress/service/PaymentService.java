package com.dairyxpress.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.dairyxpress.dto.CreatePaymentRequest;
import com.dairyxpress.dto.PaymentResponse;
import com.dairyxpress.dto.VerifyPaymentRequest;
import com.dairyxpress.entity.Payment;
import com.dairyxpress.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKey;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    public PaymentService(RazorpayClient razorpayClient,
                          PaymentRepository paymentRepository) {
        this.razorpayClient = razorpayClient;
        this.paymentRepository = paymentRepository;
    }

    // ===========================
    // Create Razorpay Order
    // ===========================

    public PaymentResponse createOrder(CreatePaymentRequest request) throws Exception {

        int amountInPaise = (int) (request.getAmount() * 100);

        JSONObject orderRequest = new JSONObject();

        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(orderRequest);

        Payment payment = new Payment();

        payment.setAmount(request.getAmount());
        payment.setRazorpayOrderId(order.get("id"));
        payment.setStatus("PENDING");
        payment.setPaymentDate(LocalDateTime.now());

        paymentRepository.save(payment);

        return new PaymentResponse(
                order.get("id"),
                razorpayKey,
                amountInPaise,
                "INR"
        );
    }

    // ===========================
    // Verify Payment
    // ===========================

    public boolean verifyPayment(VerifyPaymentRequest request) throws Exception {

        JSONObject options = new JSONObject();

        options.put("razorpay_order_id", request.getRazorpayOrderId());

        options.put("razorpay_payment_id", request.getRazorpayPaymentId());

        options.put("razorpay_signature", request.getRazorpaySignature());

        boolean verified =
                Utils.verifyPaymentSignature(options, razorpaySecret);

        Payment payment = paymentRepository
                .findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (verified) {

            payment.setStatus("SUCCESS");

            payment.setRazorpayPaymentId(
                    request.getRazorpayPaymentId());

        } else {

            payment.setStatus("FAILED");

        }

        paymentRepository.save(payment);

        return verified;
    }

}