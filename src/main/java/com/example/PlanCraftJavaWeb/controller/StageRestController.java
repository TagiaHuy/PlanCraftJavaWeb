package com.example.PlanCraftJavaWeb.controller;

import com.example.PlanCraftJavaWeb.entity.Stage;
import com.example.PlanCraftJavaWeb.service.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stages")
public class StageRestController {
    @Autowired
    private StageService stageService;

    @GetMapping("/goal/{goalId}")
    public List<Stage> getStagesByGoal(@PathVariable Long goalId) {
        return stageService.getStagesByGoalId(goalId);
    }

    @GetMapping("/{id}")
    public Optional<Stage> getStageById(@PathVariable Long id) {
        return stageService.getStageById(id);
    }

    @PostMapping
    public Stage createStage(@RequestBody Stage stage) {
        return stageService.saveStage(stage);
    }

    @PutMapping("/{id}")
    public Stage updateStage(@PathVariable Long id, @RequestBody Stage stage) {
        stage.setId(id);
        return stageService.saveStage(stage);
    }

    @DeleteMapping("/{id}")
    public void deleteStage(@PathVariable Long id) {
        stageService.deleteStage(id);
    }
} 