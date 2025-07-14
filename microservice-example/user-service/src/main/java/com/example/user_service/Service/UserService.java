package com.example.user_service.Service;

import com.example.user_service.Dto.Request.LoginRequest;
import com.example.user_service.Dto.Response.AuthenticationResponse;
import com.example.user_service.Dto.Response.UserResponse;
import com.example.user_service.Exception.ApiException;
import com.example.user_service.Exception.ErrorCode;
import com.example.user_service.Jwt.JwtUtil;
import com.example.user_service.Mapper.UserMapper;
import com.example.user_service.Model.User;
import com.example.user_service.Repository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    JwtUtil jwtUtil;

    public UserResponse getUserById(Long id){
        User user = userRepository.findById(id).
                orElseThrow(()->new ApiException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    public User authenticate(String userName,String password){
        try {
            User accountUser = userRepository.findByUserName(userName);
            if (accountUser == null) {
                throw new ApiException(ErrorCode.INVALID_USERNAME);
            }
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (!passwordEncoder.matches(password, accountUser.getPassword())) {
                throw new ApiException(ErrorCode.INVALID_PASSWORD);
            }
            return accountUser;
        } catch (Exception e) {
            throw new RuntimeException("Invalid credential", e);
        }
    }

    public AuthenticationResponse Login(LoginRequest loginRequest){
        User user = authenticate(loginRequest.getUserName(),loginRequest.getPassword());
        if (user == null) {
            throw new ApiException(ErrorCode.INVALID_USER_ACCOUNT);
        }
        String token = jwtUtil.generateToken(user.getUserId(),user.getRole().getRoleName());
        AuthenticationResponse authenticationResponse = new AuthenticationResponse(token,user.getUserId(),user.getRole().getRoleName());
        return authenticationResponse;
    }
}
