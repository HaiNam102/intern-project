package com.example.camera_service.Mapper;

import com.example.camera_service.Dto.Req.CameraReq;
import com.example.camera_service.Dto.Res.CameraRes;
import com.example.camera_service.Model.Camera;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CameraMapper {
    CameraMapper INSTANCE = Mappers.getMapper(CameraMapper.class);

    Camera toCamera(CameraReq cameraReq);

    CameraRes toCameraRes(Camera camera);

    Camera toCamera(CameraRes cameraRes);
}
