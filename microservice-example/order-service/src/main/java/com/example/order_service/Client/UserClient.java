package com.example.order_service.Client;

import com.example.order_service.Dto.Response.ApiResponse;
import com.example.order_service.Dto.Response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "http://localhost:8081")
public interface UserClient {

    @GetMapping("/api/users/id")
    ApiResponse<UserResponse> getUserByToken(@RequestHeader("Authorization") String authHeader);
}
