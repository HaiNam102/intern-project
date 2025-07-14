package com.example.order_service.Exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(40000, "user not found", HttpStatus.NOT_FOUND),
    INVALID_USERNAME(40401, "invalid username", HttpStatus.NOT_FOUND),
    INVALID_PASSWORD(40402, "invalid password", HttpStatus.NOT_FOUND),
    INVALID_USER_ACCOUNT(40402, "invalid user account", HttpStatus.NOT_FOUND),
    ;

    Integer code;
    String message;
    HttpStatus status;
}
