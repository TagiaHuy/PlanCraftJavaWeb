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
} 