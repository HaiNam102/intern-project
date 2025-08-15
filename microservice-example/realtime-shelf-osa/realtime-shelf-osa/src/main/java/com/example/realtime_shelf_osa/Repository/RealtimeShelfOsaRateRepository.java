package com.example.realtime_shelf_osa.Repository;

import com.example.realtime_shelf_osa.Model.RealtimeShelfOsaRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface RealtimeShelfOsaRateRepository extends JpaRepository<RealtimeShelfOsaRate, UUID> {
    @Query(value = """
        SELECT * FROM (
          SELECT * FROM RealtimeShelfOsaRate
          WHERE shelf_id = :shelfId
          ORDER BY ts DESC
          LIMIT 40
        ) t
        ORDER BY t.ts ASC
        """, nativeQuery = true)
    List<RealtimeShelfOsaRate> findLatestTop96Asc(@Param("shelfId") UUID shelfId);

    @Query(value = """
        SELECT *
        FROM RealtimeShelfOsaRate
        WHERE shelf_id = :shelfId
        AND ts BETWEEN :fromTs AND :toTs
        ORDER BY ts ASC
        """, nativeQuery = true)
    List<RealtimeShelfOsaRate> findByShelfTime(
            @Param("shelfId") UUID shelfId,
            @Param("fromTs") Instant from,
            @Param("toTs") Instant to);
}
