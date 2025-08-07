package com.example.camera_service.Dto.Res;

import com.example.camera_service.Enum.Status;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CameraRes {
    Long cameraId;
    String nameCamera;
    String location;
    String streamUrl;
    Status status;
}
