    package com.example.order_service.Dto.Response;
    
    import lombok.AccessLevel;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.experimental.FieldDefaults;
    
    import java.time.LocalDate;
    
    @Data
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public class OrderResponse {
        Long orderId;
        ProductResponse productResponse;
        LocalDate createdAt;
        int quantityOrder;
    }
