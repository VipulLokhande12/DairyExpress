package com.dairyxpress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ProfileSummaryDto {
    private long totalOrders;
    private long activeSubscriptions;
    private int rewardPoints;
    private long wishlistItems;
    private long savedAddresses;
    private long notifications;
}
