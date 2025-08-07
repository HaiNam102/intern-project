package com.example.camera_service.Service;

import com.example.camera_service.Dto.Res.CameraRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendStreamStartNotification(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Stream Started");
        message.setText("Your stream has started.");
        mailSender.send(message);
    }

    public void sendCameraOfflineNotification(String to, CameraRes camera, String errorMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("⚠️ Camera Offline Alert - " + camera.getNameCamera());
        
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        String emailContent = String.format("""
            🚨 CAMERA OFFLINE ALERT 🚨
            
            Camera Information:
            - Name: %s
            - ID: %d
            - Stream URL: %s
            - Location: %s
            
            Error Details:
            - Error: %s
            - Time Detected: %s
            
            Please check the camera connection and take necessary actions.
            
            Best regards,
            Camera Monitoring System
            """, 
            camera.getNameCamera(),
            camera.getCameraId(),
            camera.getStreamUrl(),
            camera.getLocation() != null ? camera.getLocation() : "Not specified",
            errorMessage,
            currentTime
        );
        
        message.setText(emailContent);
        mailSender.send(message);
    }

    public void sendCameraOnlineNotification(String to, CameraRes camera) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("✅ Camera Online - " + camera.getNameCamera());
        
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        String emailContent = String.format("""
            ✅ CAMERA ONLINE NOTIFICATION ✅
            
            Camera Information:
            - Name: %s
            - ID: %d
            - Stream URL: %s
            - Location: %s
            
            Status: Camera is now back online
            Time: %s
            
            The camera has been restored to normal operation.
            
            Best regards,
            Camera Monitoring System
            """, 
            camera.getNameCamera(),
            camera.getCameraId(),
            camera.getStreamUrl(),
            camera.getLocation() != null ? camera.getLocation() : "Not specified",
            currentTime
        );
        
        message.setText(emailContent);
        mailSender.send(message);
    }
}