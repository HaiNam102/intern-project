package com.example.user_service.Repository;

import com.example.user_service.Model.RefreshToken;
import com.example.user_service.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
    Optional<RefreshToken>findByUser(User user);
}
