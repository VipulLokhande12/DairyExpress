package com.dairyxpress.controller;

import com.dairyxpress.dto.AddressDto;
import com.dairyxpress.dto.AddressRequest;
import com.dairyxpress.dto.ApiResponse;
import com.dairyxpress.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok(addressService.getAddresses(auth.getName())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(
            Authentication auth,
            @Valid @RequestBody AddressRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Address added", addressService.addAddress(auth.getName(), req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            Authentication auth,
            @PathVariable Long id
    ) {
        addressService.deleteAddress(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.ok("Address deleted", null));
    }
}
