package com.example.realtime_shelf_osa.Controller;

import com.example.realtime_shelf_osa.Model.RealtimeShelfOsaRate;
import com.example.realtime_shelf_osa.Service.OsaRateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shelves/{shelfId}/osa-rate")
@RequiredArgsConstructor
public class OsaRateController {
    private final OsaRateService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RealtimeShelfOsaRate create(@PathVariable UUID shelfId,
                                       @Valid @RequestBody RealtimeShelfOsaRate in) {
        return service.create(shelfId, in);
    }

    @GetMapping("/latest")
    public List<RealtimeShelfOsaRate> latest(@PathVariable UUID shelfId) {
        return service.latestForShelf(shelfId);
    }
}
