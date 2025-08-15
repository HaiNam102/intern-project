package com.example.realtime_shelf_osa.Controller;

import com.example.realtime_shelf_osa.Model.RealtimeShelfDetail;
import com.example.realtime_shelf_osa.Service.ShelfDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shelves/{shelfId}/detail")
@RequiredArgsConstructor
public class ShelfDetailController {
    private final ShelfDetailService service;

    @PostMapping
    public RealtimeShelfDetail create(@PathVariable UUID shelfId,
                                      @RequestBody RealtimeShelfDetail in) {
        return service.create(shelfId, in);
    }

    @GetMapping
    public List<RealtimeShelfDetail> range(
            @PathVariable UUID shelfId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return service.range(shelfId, from, to);
    }
}
