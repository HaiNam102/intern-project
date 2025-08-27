package com.example.realtime_shelf_osa.Repository;

import com.example.realtime_shelf_osa.Model.CustomerVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerVisitRepository extends JpaRepository<CustomerVisit, UUID> {
    List<CustomerVisit> findByStore_StoreId(UUID storeId);

    List<CustomerVisit> findByShelf_ShelfId(UUID shelfId);

    @Query("""
                SELECT c 
                FROM CustomerVisit c 
                WHERE (:storeId IS NULL OR c.store.storeId = :storeId)
                  AND (:shelfId IS NULL OR c.shelf.shelfId = :shelfId)
                  AND (:start IS NULL OR c.ts >= :start)
                  AND (:end IS NULL OR c.ts <= :end)
            """)
    List<CustomerVisit> findCustomerVisits(
            @Param("storeId") UUID storeId,
            @Param("shelfId") UUID shelfId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

}
