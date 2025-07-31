package com.example.order_service.Controller;

import com.example.order_service.Dto.Request.OrderRequest;
import com.example.order_service.Dto.Response.ApiResponse;
import com.example.order_service.Dto.Response.OrderResponse;
import com.example.order_service.Dto.Response.UserOrderResponse;
import com.example.order_service.Exception.SuccessCode;
import com.example.order_service.Model.Order;
import com.example.order_service.Service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@Validated
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @GetMapping
    public ResponseEntity<?> getOrderByUserId(@RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        UserOrderResponse userOrderResponse = orderService.getOrderByUserId(authHeader, page, size);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(SuccessCode.GET_SUCCESSFUL.getCode())
                .message(SuccessCode.GET_SUCCESSFUL.getMessage())
                .data(userOrderResponse)
                .build());
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .code(SuccessCode.GET_SUCCESSFUL.getCode())
                .message(SuccessCode.GET_SUCCESSFUL.getMessage())
                .data(orderService.createOrder(orderRequest))
                .build());
    }
}
