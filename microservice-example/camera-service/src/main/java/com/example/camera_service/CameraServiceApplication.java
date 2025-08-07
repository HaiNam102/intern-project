package com.example.camera_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.camera_service.Repository.httpClient")
@EnableScheduling
public class CameraServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(CameraServiceApplication.class, args);
	}

}
