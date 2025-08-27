package com.example.realtime_shelf_osa.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "shelf_kpi_daily")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShelfKpiDaily {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "shelf_kpi_daily_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID shelfKpiId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelf_id", nullable = false)
    private Shelf shelf;

    private Instant date;

    private Double avgShortageRate;

    private Double ontimeRecoveryRate;

    private Integer shortageEvents;

    private Integer recoveryEvents;
}
