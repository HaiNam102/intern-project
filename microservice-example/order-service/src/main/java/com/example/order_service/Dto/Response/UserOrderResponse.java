package com.example.order_service.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserOrderResponse {
    UserResponse userResponse;
    List<OrderResponse> orderResponses;
    PageResponse pageResponse;
}
