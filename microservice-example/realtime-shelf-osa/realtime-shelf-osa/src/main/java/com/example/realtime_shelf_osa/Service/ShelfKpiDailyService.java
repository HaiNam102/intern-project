package com.example.realtime_shelf_osa.Service;

import com.example.realtime_shelf_osa.Model.ShelfKpiDaily;
import com.example.realtime_shelf_osa.Repository.ShelfKpiDailyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShelfKpiDailyService {

    private final ShelfKpiDailyRepository repo;

    public List<ShelfKpiDaily> getAll() {
        return repo.findAll();
    }

    public List<ShelfKpiDaily> getByStore(UUID storeId) {
        return repo.findByStoreId(storeId);
    }

    public List<ShelfKpiDaily> getByStoreAndDate(UUID storeId, Instant start, Instant end) {
        return repo.findByStoreIdAndDate(storeId, start ,end);
    }

    public ShelfKpiDaily save(ShelfKpiDaily kpi) {
        return repo.save(kpi);
    }
}
