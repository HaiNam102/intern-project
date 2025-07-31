package com.example.user_service.Repository;

import com.example.user_service.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    User findByUserName(String userName);

    @Query("SELECT u.email FROM User u WHERE u.userId = :userId")
    User getEmailByUser(@Param("userId") Long userId);
}
