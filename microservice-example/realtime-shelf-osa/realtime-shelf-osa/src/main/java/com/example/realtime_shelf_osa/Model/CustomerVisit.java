package com.example.realtime_shelf_osa.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "customer_visit")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "customer_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID customerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelf_id", nullable = false)
    private Shelf shelf;

    private LocalDateTime ts;

    private String ageGroup;

    private String gender;

    private Integer totalVisits;

    private Integer shortageVisits;
}
