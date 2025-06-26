package com.example.PlanCraftJavaWeb.service;

import com.example.PlanCraftJavaWeb.entity.Stage;
import com.example.PlanCraftJavaWeb.repository.StageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StageService {
    @Autowired
    private StageRepository stageRepository;

    public List<Stage> getStagesByGoalId(Long goalId) {
        return stageRepository.findByGoalId(goalId);
    }

    public Optional<Stage> getStageById(Long id) {
        return stageRepository.findById(id);
    }

    public Stage saveStage(Stage stage) {
        return stageRepository.save(stage);
    }

    public void deleteStage(Long id) {
        stageRepository.deleteById(id);
    }

    public void updateStageProgress(Long stageId) {
        Optional<Stage> stageOpt = stageRepository.findById(stageId);
        if (stageOpt.isPresent()) {
            Stage stage = stageOpt.get();
            
            // Tính toán progress từ tasks
            long totalTasks = stage.getTasks() != null ? stage.getTasks().size() : 0;
            long completedTasks = stage.getTasks() != null ? 
                stage.getTasks().stream()
                    .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                    .count() : 0;
            
            // Cập nhật progress percentage
            double progressPercentage = totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0.0;
            stage.setProgressPercentage(Math.round(progressPercentage * 100.0) / 100.0);
            
            // Cập nhật trạng thái
            if (totalTasks > 0 && completedTasks == totalTasks) {
                stage.setStatus("COMPLETED");
            } else if (completedTasks > 0) {
                stage.setStatus("IN_PROGRESS");
            } else {
                stage.setStatus("NOT_STARTED");
            }
            
            stageRepository.save(stage);
        }
    }
} 