package com.example.user_service.Controller;

import com.example.user_service.Dto.Request.LoginRequest;
import com.example.user_service.Dto.Request.RefreshRequest;
import com.example.user_service.Dto.Response.ApiResponse;
import com.example.user_service.Exception.SuccessCode;
import com.example.user_service.Jwt.JwtUtil;
import com.example.user_service.Model.RefreshToken;
import com.example.user_service.Service.RefreshTokenService;
import com.example.user_service.Service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;
    JwtUtil jwtUtil;
    RefreshTokenService refreshTokenService;

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

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById1(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ApiResponse.builder()
                .code(SuccessCode.GET_SUCCESSFUL.getCode())
                .message(SuccessCode.GET_SUCCESSFUL.getMessage())
                .data(userService.getUserById(id))
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

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshRequest request) {
        Optional<RefreshToken> tokenOpt = refreshTokenService.findByToken(request.getRefreshToken());

        if (tokenOpt.isEmpty() || refreshTokenService.isExpired(tokenOpt.get())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token");
        }

        Long userId = tokenOpt.get().getUser().getUserId();
        String role = tokenOpt.get().getUser().getRole().getRoleName();
        String newAccessToken = jwtUtil.generateToken(userId,role);

        return ResponseEntity.ok(Collections.singletonMap("accessToken", newAccessToken));
    }
}
