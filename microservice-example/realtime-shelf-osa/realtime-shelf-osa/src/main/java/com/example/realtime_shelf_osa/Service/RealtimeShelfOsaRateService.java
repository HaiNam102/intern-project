package com.example.realtime_shelf_osa.Service;

import com.example.realtime_shelf_osa.Model.RealtimeShelfOsaRate;
import com.example.realtime_shelf_osa.Repository.RealtimeShelfOsaRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RealtimeShelfOsaRateService {

    private final RealtimeShelfOsaRateRepository repo;

    public List<RealtimeShelfOsaRate> getAll() {
        return repo.findAll();
    }

    public List<RealtimeShelfOsaRate> getByShelf(UUID shelfId) {
        return repo.findByShelf_ShelfId(shelfId);
    }

    public RealtimeShelfOsaRate save(RealtimeShelfOsaRate rate) {
        return repo.save(rate);
    }
}