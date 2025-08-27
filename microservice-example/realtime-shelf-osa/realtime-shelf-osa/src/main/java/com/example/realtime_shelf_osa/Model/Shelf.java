package com.example.realtime_shelf_osa.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "shelf")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shelf {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "shelf_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID shelfId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    @JsonIgnore
    private Store store;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "area")
    private String area;

    @Column(name = "empty_ratio_threshold", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal emptyRatioThreshold = new BigDecimal("40.00");

    @Column(name = "is_active", nullable = true)
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
