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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderService {
    OrderRepository orderRepository;
    ProductRepository productRepository;
    OrderMapper orderMapper;
    UserClient userClient;

    public UserOrderResponse getOrderByUserId(String token){
        String bearerToken = "Bearer " + token;
        ApiResponse<UserResponse> response = userClient.getUserByToken(bearerToken);
        UserResponse userResponse = response.getData();
        List<Order> orders = orderRepository.findByUserId(userResponse.getUserId());
        List<OrderResponse> orderResponses = new ArrayList<>();
        for(Order order : orders){
            OrderResponse orderResponse = orderMapper.toOrderResponse(order);
            orderResponses.add(orderResponse);
        }
        UserOrderResponse userOrderResponse = new UserOrderResponse(userResponse,orderResponses);
        return userOrderResponse;
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
