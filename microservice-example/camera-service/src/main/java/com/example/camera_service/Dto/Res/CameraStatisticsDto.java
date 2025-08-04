package com.example.camera_service.Dto.Res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CameraStatisticsDto {
    private long totalCameras;
    private long onlineCameras;
    private long offlineCameras;
    private long unknownCameras;
} 