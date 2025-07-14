package com.example.order_service.Mapper;

import com.example.order_service.Dto.Request.OrderRequest;
import com.example.order_service.Dto.Response.OrderResponse;
import com.example.order_service.Dto.Response.ProductResponse;
import com.example.order_service.Model.Order;
import com.example.order_service.Model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    @Mapping(source = "product.productName",target = "productResponse.productName")
    @Mapping(source = "product.quantity",target = "productResponse.quantity")
    @Mapping(source = "createdAt",target = "createdAt")
    @Mapping(source = "quantityOrder",target = "quantityOrder")
    OrderResponse toOrderResponse(Order order);

    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "quantityOrder",target = "quantityOrder")
    Order toOrder(OrderRequest orderRequest);

    ProductResponse toProductResponse(Product product);
}
