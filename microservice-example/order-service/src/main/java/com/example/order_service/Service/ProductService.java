package com.example.order_service.Service;

import com.example.order_service.Dto.Response.ProductResponse;
import com.example.order_service.Mapper.OrderMapper;
import com.example.order_service.Model.Product;
import com.example.order_service.Repository.ProductRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    OrderMapper orderMapper;

    public List<ProductResponse> getAllProduct(){
        List<Product> products = productRepository.findAll();
        List<ProductResponse> productResponses = new ArrayList<>();
        for(Product product : products){
            ProductResponse productResponse = orderMapper.toProductResponse(product);
            productResponses.add(productResponse);
        }
        return productResponses;
    }
}
