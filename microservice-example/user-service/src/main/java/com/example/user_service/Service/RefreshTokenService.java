package com.example.user_service.Service;

import com.example.user_service.Model.RefreshToken;
import com.example.user_service.Model.User;
import com.example.user_service.Repository.RefreshTokenRepository;
import com.example.user_service.Repository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${app.jwt.refreshExpirationMs:604800000}")
    Long refreshTokenDurationMs;

    final RefreshTokenRepository refreshTokenRepo;

    final UserRepository userRepo;

    public RefreshToken createRefreshToken(String username) {
        User user = userRepo.findByUserName(username);

        // Kiểm tra user đã có refresh token chưa
        Optional<RefreshToken> existingTokenOpt = refreshTokenRepo.findByUser(user);

        RefreshToken token;
        if (existingTokenOpt.isPresent()) {
            // Nếu đã tồn tại, cập nhật token và ngày hết hạn
            token = existingTokenOpt.get();
            token.setToken(UUID.randomUUID().toString());
            token.setExpiryDate(LocalDateTime.now().plus(Duration.ofMillis(refreshTokenDurationMs)));
        } else {
            // Nếu chưa có, tạo token mới
            token = new RefreshToken();
            token.setUser(user);
            token.setToken(UUID.randomUUID().toString());
            token.setExpiryDate(LocalDateTime.now().plus(Duration.ofMillis(refreshTokenDurationMs)));
        }

        return refreshTokenRepo.save(token);
    }


    public boolean isExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(LocalDateTime.now());
    }

    public void deleteByUser(User user) {
        refreshTokenRepo.deleteByUser(user);
    }
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepo.findByToken(token);
    }

}
