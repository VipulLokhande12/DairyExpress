package com.dairyxpress.service;

import com.dairyxpress.dto.AddressDto;
import com.dairyxpress.dto.AddressRequest;
import com.dairyxpress.entity.Address;
import com.dairyxpress.entity.User;
import com.dairyxpress.exception.ResourceNotFoundException;
import com.dairyxpress.repository.AddressRepository;
import com.dairyxpress.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressDto> getAddresses(String email) {
        User user = getUser(email);
        return addressRepository.findByUserId(user.getId()).stream().map(this::toDto).toList();
    }

    @Transactional
    public AddressDto addAddress(String email, AddressRequest req) {
        User user = getUser(email);
        Address address = Address.builder()
                .user(user)
                .label(req.getLabel())
                .line1(req.getLine1())
                .line2(req.getLine2())
                .city(req.getCity())
                .pincode(req.getPincode())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .isDefault(req.getIsDefault() != null ? req.getIsDefault() : false)
                .build();
        addressRepository.save(address);
        return toDto(address);
    }

    @Transactional
    public void deleteAddress(String email, Long id) {
        User user = getUser(email);
        Address addr = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if (!addr.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Address not found");
        }
        addressRepository.delete(addr);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AddressDto toDto(Address a) {
        return AddressDto.builder()
                .id(a.getId())
                .label(a.getLabel())
                .line1(a.getLine1())
                .line2(a.getLine2())
                .city(a.getCity())
                .pincode(a.getPincode())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .isDefault(a.getIsDefault())
                .build();
    }
}
