package com.example.PlanCraftJavaWeb.repository;

import com.example.PlanCraftJavaWeb.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserId(Long userId);
} 