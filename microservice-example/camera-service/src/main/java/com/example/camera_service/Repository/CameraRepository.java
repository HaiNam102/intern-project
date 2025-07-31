package com.example.camera_service.Repository;

import com.example.camera_service.Model.Camera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CameraRepository extends JpaRepository<Camera,Long> {
    Camera findByStreamUrl(String streamUrl);
}
