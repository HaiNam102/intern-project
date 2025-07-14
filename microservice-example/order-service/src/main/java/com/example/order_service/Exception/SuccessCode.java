package com.example.order_service.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public enum SuccessCode {
    GET_SUCCESSFUL(1010, "Get successful", HttpStatus.OK),
    LOGIN_SUCCESSFUL(1010, "Login successful", HttpStatus.OK)
    ;

    Integer code;
    String message;
    HttpStatus status;
}
