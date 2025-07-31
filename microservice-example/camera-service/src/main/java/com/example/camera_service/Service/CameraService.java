package com.example.camera_service.Service;

import com.example.camera_service.Dto.Req.CameraReq;
import com.example.camera_service.Dto.Res.CameraRes;
import com.example.camera_service.Exception.ApiException;
import com.example.camera_service.Exception.ErrorCode;
import com.example.camera_service.Mapper.CameraMapper;
import com.example.camera_service.Model.Camera;
import com.example.camera_service.Repository.CameraRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@RequiredArgsConstructor
public class CameraService {
    CameraRepository cameraRepository;
    CameraMapper cameraMapper;

    public Camera createCamera(CameraReq cameraReq) {
        Camera camera = cameraMapper.toCamera(cameraReq);
        return cameraRepository.save(camera);
    }

    public List<CameraRes> getAllCamera(){
        List<Camera> cameras =cameraRepository.findAll();
        List<CameraRes> cameraRes = cameras.stream().map(cameraMapper::toCameraRes).toList();
        return cameraRes;
    }

    public Camera   updateCamera(Long id, CameraReq cameraReq) {
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.CAMERA_NOT_FOUND));
        camera = cameraMapper.toCamera(cameraReq);
        return cameraRepository.save(camera);
    }

    public void deleteCamera(Long id){
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.CAMERA_NOT_FOUND));
        cameraRepository.deleteById(id);
    }

    public CameraRes getCameraById(Long id){
        Camera camera = cameraRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.CAMERA_NOT_FOUND));
        return cameraMapper.toCameraRes(camera);
    }
}
