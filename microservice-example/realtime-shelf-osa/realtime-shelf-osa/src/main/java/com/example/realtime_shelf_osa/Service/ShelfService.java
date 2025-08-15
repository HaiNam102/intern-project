package com.example.realtime_shelf_osa.Service;

import com.example.realtime_shelf_osa.Dto.Req.ShelfReq;
import com.example.realtime_shelf_osa.Mapper.ShelfMapper;
import com.example.realtime_shelf_osa.Model.Shelf;
import com.example.realtime_shelf_osa.Repository.ShelfRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ShelfService {
    ShelfRepository shelfRepository;
    ShelfMapper shelfMapper;

    public Shelf create(ShelfReq s) { return shelfRepository.save(shelfMapper.toShelf(s)); }
    public Shelf get(UUID id) { return shelfRepository.findById(id).orElseThrow(); }
    public List<Shelf> list() { return shelfRepository.findAll(); }
    public Shelf update(UUID id, Shelf shelf) {
        Shelf s = get(id);
        s.setName(shelf.getName());
        s.setArea(shelf.getArea());
        s.setEmptyRatioThreshold(shelf.getEmptyRatioThreshold());
        s.setActive(shelf.isActive());
        return shelfRepository.save(s);
    }
    public void delete(UUID id) { shelfRepository.deleteById(id); }
}
