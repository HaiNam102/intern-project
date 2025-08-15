package com.example.realtime_shelf_osa.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "realtime_shelf_osa_rate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RealtimeShelfOsaRate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "osa_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID osaId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shelf_id")
    private Shelf shelf;

    @NotNull
    @Column(name = "ts", nullable = false, columnDefinition = "datetime(6)")
    private Instant ts;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    @Column(name = "osa_rate_pct", precision = 5, scale = 2, nullable = false)
    private BigDecimal osaRatePct;

    @Column(name = "duration_above_threshold_m", precision = 7, scale = 2)
    private BigDecimal durationAboveThresholdMinutes = BigDecimal.ZERO;

    @Column(name = "duration_empty_ratio_100_m", precision = 7, scale = 2)
    private BigDecimal durationEmptyRatio100Minutes = BigDecimal.ZERO;
}