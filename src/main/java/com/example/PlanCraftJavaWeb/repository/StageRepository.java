package com.example.PlanCraftJavaWeb.repository;

import com.example.PlanCraftJavaWeb.entity.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StageRepository extends JpaRepository<Stage, Long> {
    List<Stage> findByGoalId(Long goalId);
} 