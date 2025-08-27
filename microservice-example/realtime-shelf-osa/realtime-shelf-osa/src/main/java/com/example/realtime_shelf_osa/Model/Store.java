package com.example.realtime_shelf_osa.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "store")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Store {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "store_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID storeId;

    private String name;

    private String location;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Shelf> shelfs;
}
