package com.example.realtime_shelf_osa.Controller;

import com.example.realtime_shelf_osa.Dto.Req.ShelfReq;
import com.example.realtime_shelf_osa.Model.Shelf;
import com.example.realtime_shelf_osa.Service.ShelfService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shelves")
@RequiredArgsConstructor
public class ShelfController {
    private final ShelfService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Shelf create(@Valid @RequestBody ShelfReq s) {
        return service.create(s);
    }

    @GetMapping
    public List<Shelf> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Shelf get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public Shelf update(@PathVariable UUID id, @RequestBody Shelf s) {
        return service.update(id, s);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}