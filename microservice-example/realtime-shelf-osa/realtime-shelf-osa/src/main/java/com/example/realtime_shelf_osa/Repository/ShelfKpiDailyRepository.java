package com.example.realtime_shelf_osa.Repository;

import com.example.realtime_shelf_osa.Model.ShelfKpiDaily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ShelfKpiDailyRepository extends JpaRepository<ShelfKpiDaily, UUID> {
    @Query("SELECT s FROM ShelfKpiDaily s WHERE s.store.storeId = :storeId")
    List<ShelfKpiDaily> findByStoreId(@Param("store_id") UUID storeId);

    @Query("SELECT s FROM ShelfKpiDaily s WHERE (:storeId IS NULL OR s.store.storeId = :storeId) " +
            "AND s.date BETWEEN :start AND :end "+
            "ORDER BY s.date ASC")
    List<ShelfKpiDaily> findByStoreIdAndDate(@Param("storeId") UUID storeId,
                                             @Param("start") Instant start,
                                             @Param("end") Instant end);
}
