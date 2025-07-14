package com.example.user_service.Controller;

import com.example.user_service.Dto.Request.LoginRequest;
import com.example.user_service.Dto.Response.ApiResponse;
import com.example.user_service.Exception.SuccessCode;
import com.example.user_service.Jwt.JwtUtil;
import com.example.user_service.Service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;
    JwtUtil jwtUtil;

    @GetMapping("/id")
    public ResponseEntity<?> getUserById(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(SuccessCode.GET_SUCCESSFUL.getCode())
                .message(SuccessCode.GET_SUCCESSFUL.getMessage())
                .data(userService.getUserById(userId))
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(ApiResponse.builder()
                .code(SuccessCode.LOGIN_SUCCESSFUL.getCode())
                .message(SuccessCode.LOGIN_SUCCESSFUL.getMessage())
                .data(userService.Login(loginRequest))
                .build()
        );
    }
}
