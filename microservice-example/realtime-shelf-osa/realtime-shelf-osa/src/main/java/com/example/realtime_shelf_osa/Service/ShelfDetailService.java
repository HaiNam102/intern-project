package com.example.realtime_shelf_osa.Service;

import com.example.realtime_shelf_osa.Dto.ShelfDetailMessage;
import com.example.realtime_shelf_osa.Model.RealtimeShelfDetail;
import com.example.realtime_shelf_osa.Model.Shelf;
import com.example.realtime_shelf_osa.Repository.RealtimeShelfDetailRepository;
import com.example.realtime_shelf_osa.Repository.ShelfRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShelfDetailService {
    private final RealtimeShelfDetailRepository repo;
    private final ShelfRepository shelfRepo;
    private final SimpMessagingTemplate messaging;

    @Transactional
    public RealtimeShelfDetail create(UUID shelfId, RealtimeShelfDetail in) {
        Shelf shelf = shelfRepo.findById(shelfId).orElseThrow();
        in.setShelf(shelf);
        RealtimeShelfDetail saved = repo.save(in);
        ShelfDetailMessage msg = new ShelfDetailMessage(
                saved.getDetailId(), shelf.getShelfId(), saved.getWindowStart(), saved.getWindowEnd(),
                saved.getShelfOperatingHours(), saved.getShelfShortageHours(), saved.getShelfShortageRate(),
                saved.getTimesAlerted(), saved.getTimesReplenished()
        );
        messaging.convertAndSend("/topic/shelf/" + shelf.getShelfId() + "/detail", msg);
        return saved;
    }

    public List<RealtimeShelfDetail> range(UUID shelfId, Instant from, Instant to) {
        return repo.findByShelfAndWindowRange(shelfId, from, to);
    }
}
