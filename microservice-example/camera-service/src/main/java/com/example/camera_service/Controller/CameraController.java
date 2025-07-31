package com.example.camera_service.Controller;


import com.example.camera_service.Dto.Req.CameraReq;
import com.example.camera_service.Dto.Res.ApiResponse;
import com.example.camera_service.Model.Camera;
import com.example.camera_service.Service.CameraHealthService;
import com.example.camera_service.Service.CameraService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CameraController {

    CameraService cameraService;
    CameraHealthService cameraHealthService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody CameraReq cameraReq) {
        Camera camera = cameraService.createCamera(cameraReq);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("create success")
                .data(camera)
                .build());
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("get success")
                .data(cameraService.getAllCamera())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("get success")
                .data(cameraService.getCameraById(id))
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CameraReq cameraReq) {
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("create success")
                .data(cameraService.updateCamera(id, cameraReq))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        cameraService.deleteCamera(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("delete success")
                .build());
    }

    @PostMapping("/{id}/check-health")
    public ResponseEntity<?> checkHealth(@PathVariable Long id) {
        cameraHealthService.checkCameraHealth(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("create success")
                .build());
    }
}

