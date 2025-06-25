package com.example.PlanCraftJavaWeb.repository;

import com.example.PlanCraftJavaWeb.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStageId(Long stageId);
} 