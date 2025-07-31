package com.example.order_service.Dto.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    @NotNull(message = "UserId NOT NULL")
    @Min(value = 1, message = "User ID must be a positive number")
    Long userId;

    @NotNull(message = "Product ID cannot be null")
    @Min(value = 1, message = "Product ID must be a positive number")
    Long productId;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    Integer quantityOrder;
}
