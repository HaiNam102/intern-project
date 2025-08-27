package com.example.realtime_shelf_osa.Repository;

import com.example.realtime_shelf_osa.Model.RealtimeShelfDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface RealtimeShelfDetailRepository extends JpaRepository<RealtimeShelfDetail, UUID> {
    @Query(value = """
            SELECT *
            FROM realtime_shelf_detail
            WHERE shelf_id = :shelfId
              AND window_start >= :startTs
              AND window_end <= :endTs
            ORDER BY window_start ASC
            """, nativeQuery = true)
    List<RealtimeShelfDetail> findByShelfAndWindowRange(
            @Param("shelfId") UUID shelfId,
            @Param("startTs") Instant start,
            @Param("endTs") Instant end
    );

    @Query("SELECT AVG(d.shelfShortageRate) FROM RealtimeShelfDetail d WHERE d.shelf.store.storeId = :storeId")
    Double findAvgByStore(@Param("storeId") UUID storeId);

    @Query("""
            SELECT FUNCTION('DATE', d.windowStart), AVG(d.shelfShortageRate)
            FROM RealtimeShelfDetail d
            WHERE d.shelf.store.storeId = :storeId
              AND (:shelfIds IS NULL OR d.shelf.shelfId IN :shelfIds)
              AND d.windowStart BETWEEN :dateStart AND :dateEnd
            GROUP BY FUNCTION('DATE', d.windowStart)
            ORDER BY FUNCTION('DATE', d.windowStart)
            """)
    List<Object[]> findDailyAvgByStoreAndShelves(
            @Param("storeId") UUID storeId,
            @Param("shelfIds") List<UUID> shelfIds,
            @Param("dateStart") Instant dateStart,
            @Param("dateEnd") Instant dateEnd);

}
