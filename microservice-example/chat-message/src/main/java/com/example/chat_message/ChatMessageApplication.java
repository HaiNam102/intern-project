package com.example.chat_message;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ChatMessageApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatMessageApplication.class, args);
	}

}
