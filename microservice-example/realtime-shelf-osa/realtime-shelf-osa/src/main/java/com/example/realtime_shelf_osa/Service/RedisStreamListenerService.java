//package com.example.realtime_shelf_osa.Service;
//
//import com.example.realtime_shelf_osa.Model.*;
//import com.example.realtime_shelf_osa.Repository.*;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import jakarta.annotation.PostConstruct;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import org.springframework.data.redis.connection.stream.MapRecord;
//import org.springframework.data.redis.connection.stream.ReadOffset;
//import org.springframework.data.redis.connection.stream.StreamOffset;
//import org.springframework.data.redis.connection.stream.StreamReadOptions;
//import org.springframework.data.redis.core.StringRedisTemplate;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//import java.math.RoundingMode;
//import java.time.Duration;
//
//import java.time.Instant;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//class RedisStreamListenerService {
//    StringRedisTemplate redisTemplate;
//    ObjectMapper objectMapper;
//    RealtimeShelfDetailRepository detailRepo;
//    RealtimeShelfOsaRateRepository osaRepo;
//    ShelfRepository shelfRepo;
//    StoreRepository storeRepository;
//    SimpMessagingTemplate messagingTemplate;
//    ShelfKpiDailyRepository shelfKpiDailyRepository;
//
//    private static final String STREAM_KEY = "shelf_updates";
//
//    @PostConstruct
//    public void startListening() {
//        new Thread(() -> {
//            String lastId = "$";
//            while (true) {
//                try {
//                    // Đọc 1 record mới nhất
//                    List<MapRecord<String, Object, Object>> records = redisTemplate.opsForStream()
//                            .read(StreamReadOptions.empty()
//                                            .count(1)
//                                            .block(Duration.ZERO),
//                                    StreamOffset.create(STREAM_KEY, ReadOffset.from(lastId)));
//
//                    if (records != null) {
//                        for (MapRecord<String, Object, Object> record : records) {
//                            lastId = record.getId().getValue();
//                            String json = (String) record.getValue().get("data");
//
//                            // Parse JSON
//                            Map<String, Object> payload = objectMapper.readValue(json, Map.class);
//
//                            // Phân loại theo "type"
//                            String type = (String) payload.get("type");
//                            switch (type) {
//                                case "RealtimeShelfDetail" -> {
//                                    saveDetail(payload);
//                                    saveShelfKpiDaily(payload);
//                                }
//                                case "RealtimeShelfOsaRate" -> saveOsa(payload);
////                                case "Shelf" -> saveShelf(payload);
//                            }
//                            messagingTemplate.convertAndSend("/topic/shelf-updates", payload);
//                        }
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            }
//        }).start();
//    }
//
//    private void saveShelfKpiDaily(Map<String, Object> payload) {
//        try {
//            UUID shelfId = UUID.fromString((String) payload.get("shelfId"));
//            Optional<Shelf> shelfOpt = shelfRepo.findById(shelfId);
//            if (shelfOpt.isEmpty()) {
//                System.out.println("Shelf not found for ID: " + shelfId);
//                return;
//            }
//            Store store = shelfRepo.findStoreByShelfId(shelfId);
//            double shortageHours = ((Number) payload.get("shelfShortageHours")).doubleValue();
//            double operatingHours = ((Number) payload.get("shelfOperatingHours")).doubleValue();
//            double timesAlerted = ((Number) payload.get("timesAlerted")).doubleValue();
//            double timesReplenished = ((Number) payload.get("timesReplenished")).doubleValue();
//
//            double avgShortageRate = (operatingHours > 0)
//                    ? (shortageHours / operatingHours) * 100
//                    : 0.0;
//
//            double ontimeRecoveryRate = (timesReplenished > 0)
//                    ? (timesAlerted / timesReplenished) * 100
//                    : 0.0;
//            ShelfKpiDaily shelfKpiDaily = ShelfKpiDaily.builder()
//                    .store(store)
//                    .shelf(shelfOpt.get())
//                    .date(Instant.ofEpochMilli(((Number) payload.get("windowStart")).longValue()))
//                    .avgShortageRate(avgShortageRate)
//                    .ontimeRecoveryRate(ontimeRecoveryRate)
//                    .shortageEvents(((Number) payload.get("timesAlerted")).intValue())
//                    .recoveryEvents(((Number) payload.get("timesReplenished")).intValue())
//                    .build();
//
//            shelfKpiDailyRepository.save(shelfKpiDaily);
////            messagingTemplate.convertAndSend("/topic/shelf-updates", shelfKpiDaily);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private void saveDetail(Map<String, Object> payload) {
//        try {
//            UUID shelfId = UUID.fromString((String) payload.get("shelfId"));
//
//            // Lấy Shelf từ DB (hoặc null nếu chưa có)
//            Optional<Shelf> shelfOpt = shelfRepo.findById(shelfId);
//            if (shelfOpt.isEmpty()) {
//                System.out.println("Shelf not found for ID: " + shelfId);
//                return;
//            }
//            BigDecimal shortageHours = BigDecimal.valueOf(((Number) payload.get("shelfShortageHours")).doubleValue());
//            BigDecimal operatingHours = BigDecimal.valueOf(((Number) payload.get("shelfOperatingHours")).doubleValue());
//
//            BigDecimal shortageRate = BigDecimal.ZERO;
//            if (operatingHours.compareTo(BigDecimal.ZERO) > 0) {
//                shortageRate = shortageHours
//                        .divide(operatingHours, 4, RoundingMode.HALF_UP)
//                        .multiply(BigDecimal.valueOf(100));
//            }
//            RealtimeShelfDetail detail = RealtimeShelfDetail.builder()
//                    .shelf(shelfOpt.get())
//                    .windowStart(Instant.ofEpochMilli(((Number) payload.get("windowStart")).longValue()))
//                    .windowEnd(Instant.ofEpochMilli(((Number) payload.get("windowEnd")).longValue()))
//                    .shelfOperatingHours(operatingHours)
//                    .shelfShortageRate(shortageRate)   // luôn có giá trị
//                    .shelfShortageHours(shortageHours)
//                    .timesAlerted(((Number) payload.get("timesAlerted")).intValue())
//                    .timesReplenished(((Number) payload.get("timesReplenished")).intValue())
//                    .build();
//
//            detailRepo.save(detail);
//            System.out.println("✅ Saved RealtimeShelfDetail: " + detail.getDetailId());
////            messagingTemplate.convertAndSend("/topic/shelf-updates", detail);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private void saveOsa(Map<String, Object> payload) {
//        try {
//            UUID shelfId = UUID.fromString((String) payload.get("shelfId"));
//
//            Optional<Shelf> shelfOpt = shelfRepo.findById(shelfId);
//            if (shelfOpt.isEmpty()) {
//                System.out.println("Shelf not found for ID: " + shelfId);
//                return;
//            }
//
//            RealtimeShelfOsaRate osa = RealtimeShelfOsaRate.builder()
//                    .shelf(shelfOpt.get())
//                    .ts(Instant.ofEpochMilli(((Number) payload.get("ts")).longValue()))
//                    .osaRatePct(BigDecimal.valueOf(((Number) payload.get("osaRatePct")).doubleValue()))
//                    .durationAboveThresholdMinutes(BigDecimal.valueOf(((Number) payload.get("durationAboveThresholdMinutes")).doubleValue()))
//                    .durationEmptyRatio100Minutes(BigDecimal.valueOf(((Number) payload.get("durationEmptyRatio100Minutes")).doubleValue()))
//                    .build();
//
//            osaRepo.save(osa);
////            messagingTemplate.convertAndSend("/topic/shelf-updates", osa);
//            System.out.println("✅ Saved RealtimeShelfOsaRate: " + osa.getOsaId());
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private void saveShelf(Map<String, Object> payload) {
//        try {
//            UUID shelfId = UUID.fromString((String) payload.get("shelfId"));
//
//            // Nếu shelf đã tồn tại → update, ngược lại → tạo mới
//            Shelf shelf = shelfRepo.findById(shelfId).orElse(new Shelf());
//            shelf.setShelfId(shelfId);
//            shelf.setName((String) payload.get("name"));
//            shelf.setArea((String) payload.get("area"));
//            shelf.setEmptyRatioThreshold(BigDecimal.valueOf(((Number) payload.get("emptyRatioThreshold")).doubleValue()));
//            shelf.setActive((Boolean) payload.get("isActive"));
//
//            shelfRepo.save(shelf);
//            System.out.println("✅ Saved Shelf: " + shelf.getShelfId());
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//}
