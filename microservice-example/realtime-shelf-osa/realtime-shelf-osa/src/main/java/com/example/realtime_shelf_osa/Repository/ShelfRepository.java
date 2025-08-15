package com.example.realtime_shelf_osa.Repository;

import com.example.realtime_shelf_osa.Model.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ShelfRepository extends JpaRepository<Shelf, UUID> {
}
