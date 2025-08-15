package com.example.realtime_shelf_osa.Dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OsaRateMessage(
        UUID osaId,
        UUID shelfId,
        Instant ts,
        BigDecimal osaRatePct,
        BigDecimal durationAboveThresholdMinutes,
        BigDecimal durationEmptyRatio100Minutes
) {}
