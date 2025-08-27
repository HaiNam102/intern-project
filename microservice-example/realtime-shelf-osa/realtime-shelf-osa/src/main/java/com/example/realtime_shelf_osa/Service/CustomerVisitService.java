package com.example.realtime_shelf_osa.Service;

import com.example.realtime_shelf_osa.Model.CustomerVisit;
import com.example.realtime_shelf_osa.Repository.CustomerVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerVisitService {

    private final CustomerVisitRepository repo;

    public List<CustomerVisit> getAll() {
        return repo.findAll();
    }

    public List<CustomerVisit> getByStore(UUID storeId) {
        return repo.findByStore_StoreId(storeId);
    }

    public List<CustomerVisit> getByShelf(UUID shelfId) {
        return repo.findByShelf_ShelfId(shelfId);
    }

    public List<CustomerVisit> getCustomerVisits(UUID storeId, UUID shelfId, LocalDate start,LocalDate end){
        return repo.findCustomerVisits(storeId,shelfId,start,end);
    }
    public CustomerVisit save(CustomerVisit visit) {
        return repo.save(visit);
    }
}
