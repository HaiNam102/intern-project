package com.example.realtime_shelf_osa.Repository;

import com.example.realtime_shelf_osa.Model.RealtimeShelfDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
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

}
