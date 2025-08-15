package com.example.realtime_shelf_osa.Service;

import com.example.realtime_shelf_osa.Dto.OsaRateMessage;
import com.example.realtime_shelf_osa.Model.RealtimeShelfOsaRate;
import com.example.realtime_shelf_osa.Model.Shelf;
import com.example.realtime_shelf_osa.Repository.RealtimeShelfOsaRateRepository;
import com.example.realtime_shelf_osa.Repository.ShelfRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OsaRateService {
    RealtimeShelfOsaRateRepository repo;
    ShelfRepository shelfRepo;
    SimpMessagingTemplate messaging;

    @Transactional
    public RealtimeShelfOsaRate create(UUID shelfId, RealtimeShelfOsaRate in) {
        Shelf shelf = shelfRepo.findById(shelfId).orElseThrow();
        in.setShelf(shelf);
        RealtimeShelfOsaRate saved = repo.save(in);
        // Broadcast to global and per-shelf topics
        OsaRateMessage msg = new OsaRateMessage(
                saved.getOsaId(),
                shelf.getShelfId(),
                saved.getTs(),
                saved.getOsaRatePct(),
                saved.getDurationAboveThresholdMinutes(),
                saved.getDurationEmptyRatio100Minutes()
        );
        messaging.convertAndSend("/topic/osa-rate", msg);
        messaging.convertAndSend("/topic/shelf/" + shelf.getShelfId() + "/osa-rate", msg);
        return saved;
    }

    public List<RealtimeShelfOsaRate> latestForShelf(UUID shelfId) {
        return repo.findLatestTop96Asc(shelfId);
    }
}
