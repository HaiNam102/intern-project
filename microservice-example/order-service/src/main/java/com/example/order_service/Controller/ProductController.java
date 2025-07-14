package com.example.order_service.Controller;

import com.example.order_service.Dto.Response.ApiResponse;
import com.example.order_service.Dto.Response.UserOrderResponse;
import com.example.order_service.Exception.SuccessCode;
import com.example.order_service.Model.Product;
import com.example.order_service.Service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductController {
    ProductService productService;

    @GetMapping
    public ResponseEntity<?> getAllProduct() {
        return ResponseEntity.ok(ApiResponse.builder()
                .code(SuccessCode.GET_SUCCESSFUL.getCode())
                .message(SuccessCode.GET_SUCCESSFUL.getMessage())
                .data(productService.getAllProduct())
                .build());
    }
}
