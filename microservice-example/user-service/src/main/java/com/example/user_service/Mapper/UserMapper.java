package com.example.user_service.Mapper;

import ch.qos.logback.core.model.ComponentModel;
import com.example.user_service.Dto.Response.UserResponse;
import com.example.user_service.Model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "userId", target = "userId")
    UserResponse toUserResponse(User user);
}
