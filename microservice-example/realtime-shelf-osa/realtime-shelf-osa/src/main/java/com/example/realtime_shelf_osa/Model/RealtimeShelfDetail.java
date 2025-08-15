package com.example.realtime_shelf_osa.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "realtime_shelf_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RealtimeShelfDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "detail_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID detailId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shelf_id")
    private Shelf shelf;

    @NotNull
    @Column(name = "window_start", nullable = false, columnDefinition = "datetime(6)")
    private Instant windowStart;

    @NotNull
    @Column(name = "window_end", nullable = false, columnDefinition = "datetime(6)")
    private Instant windowEnd;

    @NotNull
    @Column(name = "shelf_operating_hours", precision = 7, scale = 2, nullable = false)
    private BigDecimal shelfOperatingHours;

    @NotNull
    @Column(name = "shelf_shortage_hours", precision = 7, scale = 2, nullable = false)
    private BigDecimal shelfShortageHours;

    // generated stored column in DB; mark read-only for JPA
    @Column(name = "shelf_shortage_rate", precision = 5, scale = 2, insertable = false, updatable = false)
    private BigDecimal shelfShortageRate;

    @Column(name = "times_alerted", nullable = false)
    private int timesAlerted = 0;

    @Column(name = "times_replenished", nullable = false)
    private int timesReplenished = 0;
}
