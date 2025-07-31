package com.example.camera_service.Enum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public enum Status {
    ONLINE("online"),
    OFFLINE("offline"),
    UNKNOWN("unknow");

    String status;
}
