package com.example.chat_message.Repository.httpClient;

import com.example.chat_message.Dto.ApiResponse;
import com.example.chat_message.Dto.Response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "http://localhost:8081")
public interface UserClient {
    @GetMapping("/api/users/id")
    ApiResponse<UserResponse> getUserByToken(@RequestHeader("Authorization") String authHeader);

    @GetMapping("/api/users/{id}")
    ApiResponse<UserResponse> getUserByToken1(@PathVariable("id") Long id);
}
