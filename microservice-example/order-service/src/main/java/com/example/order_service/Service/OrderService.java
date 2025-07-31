package com.example.order_service.Service;

import com.example.order_service.Client.UserClient;
import com.example.order_service.Dto.Request.OrderRequest;
import com.example.order_service.Dto.Response.*;
import com.example.order_service.Exception.ApiException;
import com.example.order_service.Exception.ErrorCode;
import com.example.order_service.Mapper.OrderMapper;
import com.example.order_service.Model.Order;
import com.example.order_service.Model.Product;
import com.example.order_service.Repository.OrderRepository;
import com.example.order_service.Repository.ProductRepository;
import com.mysql.cj.log.Log;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderService {
    OrderRepository orderRepository;
    ProductRepository productRepository;
    OrderMapper orderMapper;
    UserClient userClient;

    public UserOrderResponse getOrderByUserId(String authHeader, int page, int size) {
        ApiResponse<UserResponse> response = userClient.getUserByToken(authHeader);

        UserResponse userResponse = response.getData();
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findByUserId(userResponse.getUserId(), pageable);
        
        List<OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
        
        PageResponse pageResponse = new PageResponse(
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
        
        return new UserOrderResponse(userResponse, orderResponses, pageResponse);
    }

    @Transactional
    public Order createOrder(OrderRequest orderRequest){
        Order order = orderMapper.toOrder(orderRequest);
        Product product = productRepository.findById(orderRequest.getProductId()).
                orElseThrow(()->new RuntimeException("NOT FOUND"));
        order.setCreatedAt(LocalDate.now());
        order.setProduct(product);
        orderRepository.save(order);
        return order;
    }
}
