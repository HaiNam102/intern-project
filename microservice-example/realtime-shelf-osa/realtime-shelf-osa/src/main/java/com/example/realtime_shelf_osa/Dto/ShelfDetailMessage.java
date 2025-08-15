package com.example.realtime_shelf_osa.Dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ShelfDetailMessage(
        UUID detailId,
        UUID shelfId,
        Instant windowStart,
        Instant windowEnd,
        BigDecimal shelfOperatingHours,
        BigDecimal shelfShortageHours,
        BigDecimal shelfShortageRate,
        int timesAlerted,
        int timesReplenished
) {}
