package com.example.realtime_shelf_osa.Repository;

import com.example.realtime_shelf_osa.Model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID> {
//    @Query("SELECT s FROM Store s WHERE s.shelfs.shelfId = :shelfId")
//    Store findStoreByShelfId(@Param("shelfId") UUID shelfId);
}
