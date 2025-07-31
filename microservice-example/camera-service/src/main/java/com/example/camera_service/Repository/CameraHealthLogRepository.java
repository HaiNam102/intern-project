package com.example.camera_service.Repository;

import com.example.camera_service.Model.CameraHealthLog;
import org.apache.catalina.LifecycleState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CameraHealthLogRepository extends JpaRepository<CameraHealthLog,Long> {
    List<CameraHealthLog> findByLogIdOrderByTimeStampDesc(Long cameraId);
}
