package com.example.camera_service.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "camera.notification")
public class EmailConfig {
    
    private List<String> adminEmails = List.of("hainamluu01@gmail.com");
    private boolean enableEmailNotifications = false;
    private boolean enableOnlineNotifications = false;
    
    public List<String> getAdminEmails() {
        return adminEmails;
    }
    
    public void setAdminEmails(List<String> adminEmails) {
        this.adminEmails = adminEmails;
    }
    
    public boolean isEnableEmailNotifications() {
        return enableEmailNotifications;
    }
    
    public void setEnableEmailNotifications(boolean enableEmailNotifications) {
        this.enableEmailNotifications = enableEmailNotifications;
    }
    
    public boolean isEnableOnlineNotifications() {
        return enableOnlineNotifications;
    }
    
    public void setEnableOnlineNotifications(boolean enableOnlineNotifications) {
        this.enableOnlineNotifications = enableOnlineNotifications;
    }
} 