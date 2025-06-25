package com.example.PlanCraftJavaWeb.repository;

import com.example.PlanCraftJavaWeb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // Có thể thêm các phương thức truy vấn tùy chỉnh ở đây
    User findByUsername(String username);
    User findByEmail(String email);
} 