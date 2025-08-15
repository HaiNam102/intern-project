package com.example.realtime_shelf_osa.Mapper;

import com.example.realtime_shelf_osa.Dto.Req.ShelfReq;
import com.example.realtime_shelf_osa.Model.Shelf;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ShelfMapper {
    ShelfMapper INSTANCE = Mappers.getMapper(ShelfMapper.class);

    Shelf toShelf(ShelfReq shelfReq);
}
