//package com.example.chat_message.Service;
//
//import com.example.chat_message.Dto.Request.IntrospectRequest;
//import com.example.chat_message.Dto.Response.IntrospectResponse;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//public class IdentityService {
//    IdentityClient identityClient;
//
//    public IntrospectResponse introspect(IntrospectRequest request) {
//        try {
//            var result =  identityClient.introspect(request).getResult();
//            if (Objects.isNull(result)) {
//                return IntrospectResponse.builder()
//                        .valid(false)
//                        .build();
//            }
//            return result;
//        } catch (FeignException e) {
//            log.error("Introspect failed: {}", e.getMessage(), e);
//            return IntrospectResponse.builder()
//                    .valid(false)
//                    .build();
//        }
//    }
//}
